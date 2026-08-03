import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Sprint } from '../../entities/sprint.entity';
import { Project } from '../../entities/project.entity';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private sprintsRepository: Repository<Sprint>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
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
}
