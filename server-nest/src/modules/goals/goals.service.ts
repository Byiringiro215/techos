import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Goal } from '../../entities/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
  ) {}

  async create(org_id: string, createDto: CreateGoalDto) {
    const goal = this.goalRepository.create({
      id: randomUUID(),
      org_id,
      ...createDto,
      status: 'active',
      progress: 0,
    });

    await this.goalRepository.save(goal);
    return { success: true, data: goal };
  }

  async findAll(org_id: string, filters?: any) {
    const query = this.goalRepository.createQueryBuilder('goal')
      .where('goal.org_id = :org_id', { org_id });

    if (filters?.type) {
      query.andWhere('goal.type = :type', { type: filters.type });
    }

    if (filters?.status) {
      query.andWhere('goal.status = :status', { status: filters.status });
    }

    if (filters?.owner_id) {
      query.andWhere('goal.owner_id = :owner_id', { owner_id: filters.owner_id });
    }

    if (filters?.quarter) {
      query.andWhere('goal.quarter = :quarter', { quarter: filters.quarter });
    }

    if (filters?.parent_goal_id) {
      query.andWhere('goal.parent_goal_id = :parent_goal_id', { parent_goal_id: filters.parent_goal_id });
    }

    query.orderBy('goal.created_at', 'DESC');

    const goals = await query.getMany();
    return { success: true, data: goals };
  }

  async findOne(id: string, org_id: string) {
    const goal = await this.goalRepository.findOne({
      where: { id, org_id },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    // Get child goals
    const childGoals = await this.goalRepository.find({
      where: { parent_goal_id: id, org_id },
    });

    return { 
      success: true, 
      data: {
        ...goal,
        child_goals: childGoals,
      }
    };
  }

  async update(id: string, org_id: string, updateDto: UpdateGoalDto) {
    const goal = await this.goalRepository.findOne({
      where: { id, org_id },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    // Calculate progress from key results if provided
    if (updateDto.key_results) {
      const totalProgress = updateDto.key_results.reduce((sum, kr) => {
        const krProgress = (kr.current / kr.target) * 100;
        return sum + krProgress;
      }, 0);
      updateDto.progress = Math.min(100, totalProgress / updateDto.key_results.length);
    }

    Object.assign(goal, updateDto);
    await this.goalRepository.save(goal);

    return { success: true, data: goal };
  }

  async remove(id: string, org_id: string) {
    const goal = await this.goalRepository.findOne({
      where: { id, org_id },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    await this.goalRepository.remove(goal);
    return { success: true, message: 'Goal deleted successfully' };
  }

  async updateKeyResult(id: string, org_id: string, keyResultIndex: number, current: number) {
    const goal = await this.goalRepository.findOne({
      where: { id, org_id },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (!goal.key_results || !goal.key_results[keyResultIndex]) {
      throw new NotFoundException('Key result not found');
    }

    goal.key_results[keyResultIndex].current = current;

    // Recalculate overall progress
    const totalProgress = goal.key_results.reduce((sum, kr) => {
      const krProgress = (kr.current / kr.target) * 100;
      return sum + Math.min(100, krProgress);
    }, 0);
    goal.progress = totalProgress / goal.key_results.length;

    await this.goalRepository.save(goal);
    return { success: true, data: goal };
  }

  async getAlignment(org_id: string) {
    // Get all company-level goals
    const companyGoals = await this.goalRepository.find({
      where: { org_id, type: 'company', status: 'active' },
    });

    // Build alignment tree
    const alignment = await Promise.all(
      companyGoals.map(async (companyGoal) => {
        const departmentGoals = await this.goalRepository.find({
          where: { org_id, parent_goal_id: companyGoal.id },
        });

        const departmentWithTeamGoals = await Promise.all(
          departmentGoals.map(async (deptGoal) => {
            const teamGoals = await this.goalRepository.find({
              where: { org_id, parent_goal_id: deptGoal.id },
            });
            return { ...deptGoal, team_goals: teamGoals };
          })
        );

        return {
          ...companyGoal,
          department_goals: departmentWithTeamGoals,
        };
      })
    );

    return { success: true, data: alignment };
  }

  async getProgressReport(org_id: string, quarter?: string) {
    const query = this.goalRepository.createQueryBuilder('goal')
      .where('goal.org_id = :org_id', { org_id })
      .andWhere('goal.status = :status', { status: 'active' });

    if (quarter) {
      query.andWhere('goal.quarter = :quarter', { quarter });
    }

    const goals = await query.getMany();

    const report = {
      total_goals: goals.length,
      by_type: {
        company: goals.filter(g => g.type === 'company').length,
        department: goals.filter(g => g.type === 'department').length,
        team: goals.filter(g => g.type === 'team').length,
        individual: goals.filter(g => g.type === 'individual').length,
      },
      average_progress: goals.reduce((sum, g) => sum + g.progress, 0) / goals.length || 0,
      on_track: goals.filter(g => g.progress >= 70).length,
      at_risk: goals.filter(g => g.progress < 70 && g.progress >= 40).length,
      off_track: goals.filter(g => g.progress < 40).length,
    };

    return { success: true, data: report };
  }
}
