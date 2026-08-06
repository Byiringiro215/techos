import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Sprint } from '../../entities/sprint.entity';
import { Project } from '../../entities/project.entity';
import { Task } from '../../entities/task.entity';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private sprintsRepository: Repository<Sprint>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(org_id: string, createSprintDto: any) {
    const project = await this.projectsRepository.findOne({
      where: { id: createSprintDto.project_id, org_id },
    });
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const sprint = this.sprintsRepository.create({
      id: randomUUID(),
      ...createSprintDto,
    });

    await this.sprintsRepository.save(sprint);
    return { success: true, data: sprint };
  }

  async findAll(org_id: string, project_id?: string) {
    const queryBuilder = this.sprintsRepository
      .createQueryBuilder('sprint')
      .leftJoin(Project, 'project', 'sprint.project_id = project.id')
      .where('project.org_id = :org_id', { org_id });

    if (project_id) {
      queryBuilder.andWhere('sprint.project_id = :project_id', { project_id });
    }

    const sprints = await queryBuilder.select('sprint.*').getRawMany();
    return { success: true, data: sprints };
  }

  async findOne(id: string, org_id: string) {
    const sprint = await this.sprintsRepository
      .createQueryBuilder('sprint')
      .leftJoin(Project, 'project', 'sprint.project_id = project.id')
      .where('sprint.id = :id', { id })
      .andWhere('project.org_id = :org_id', { org_id })
      .select('sprint.*')
      .getRawOne();

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    return { success: true, data: sprint };
  }

  async update(id: string, org_id: string, updateSprintDto: any) {
    const sprint = await this.findOne(id, org_id);
    await this.sprintsRepository.update(id, updateSprintDto);
    const updated = await this.sprintsRepository.findOne({ where: { id } });
    return { success: true, data: updated };
  }

  async remove(id: string, org_id: string) {
    await this.findOne(id, org_id);
    await this.sprintsRepository.delete(id);
    return { success: true, message: 'Sprint deleted successfully' };
  }

  async getStats(id: string, org_id: string) {
    await this.findOne(id, org_id);
    const tasks = await this.tasksRepository.find({ where: { sprint_id: id } });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'done').length;

    return {
      success: true,
      data: {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        completion_rate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
    };
  }

  async findActiveSprint(project_id: string, org_id: string) {
    const sprint = await this.sprintsRepository
      .createQueryBuilder('sprint')
      .leftJoin(Project, 'project', 'sprint.project_id = project.id')
      .where('sprint.project_id = :project_id', { project_id })
      .andWhere('project.org_id = :org_id', { org_id })
      .andWhere('sprint.status = :status', { status: 'active' })
      .select('sprint.*')
      .orderBy('sprint.created_at', 'DESC')
      .getRawOne();

    return { success: true, data: sprint || null };
  }

  async startSprint(id: string, org_id: string) {
    const sprint = await this.sprintsRepository.findOne({ where: { id } });
    await this.findOne(id, org_id);
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    sprint.status = 'active';
    await this.sprintsRepository.save(sprint);
    return { success: true, data: sprint };
  }

  async completeSprint(id: string, org_id: string) {
    const sprint = await this.sprintsRepository.findOne({ where: { id } });
    await this.findOne(id, org_id);
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    sprint.status = 'completed';
    await this.sprintsRepository.save(sprint);
    return { success: true, data: sprint };
  }

  async addTaskToSprint(sprint_id: string, task_id: string, org_id: string) {
    await this.findOne(sprint_id, org_id);
    const task = await this.tasksRepository
      .createQueryBuilder('task')
      .leftJoin(Project, 'project', 'task.project_id = project.id')
      .where('task.id = :task_id', { task_id })
      .andWhere('project.org_id = :org_id', { org_id })
      .select('task.*')
      .getRawOne();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.update(task_id, { sprint_id });
    return { success: true, message: 'Task added to sprint' };
  }

  async removeTaskFromSprint(sprint_id: string, task_id: string, org_id: string) {
    await this.findOne(sprint_id, org_id);
    const task = await this.tasksRepository
      .createQueryBuilder('task')
      .leftJoin(Project, 'project', 'task.project_id = project.id')
      .where('task.id = :task_id', { task_id })
      .andWhere('project.org_id = :org_id', { org_id })
      .select('task.*')
      .getRawOne();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.update(task_id, { sprint_id: null as any });
    return { success: true, message: 'Task removed from sprint' };
  }
}
