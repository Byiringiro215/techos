import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(org_id: string, user_id: string, createTaskDto: any) {
    // Verify project belongs to org
    const project = await this.projectsRepository.findOne({
      where: { id: createTaskDto.project_id, org_id },
    });
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const task = this.tasksRepository.create({
      id: randomUUID(),
      ...createTaskDto,
      reporter_id: user_id,
    });

    await this.tasksRepository.save(task);
    return { success: true, data: task };
  }

  async findAll(org_id: string, filters?: any) {
    const queryBuilder = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoin(Project, 'project', 'task.project_id = project.id')
      .where('project.org_id = :org_id', { org_id });

    if (filters?.project_id) {
      queryBuilder.andWhere('task.project_id = :project_id', { project_id: filters.project_id });
    }
    if (filters?.status) {
      queryBuilder.andWhere('task.status = :status', { status: filters.status });
    }
    if (filters?.assignee_id) {
      queryBuilder.andWhere('task.assignee_id = :assignee_id', { assignee_id: filters.assignee_id });
    }

    const tasks = await queryBuilder.select('task.*').getRawMany();
    return { success: true, data: tasks };
  }

  async findOne(id: string, org_id: string) {
    const task = await this.tasksRepository
      .createQueryBuilder('task')
      .leftJoin(Project, 'project', 'task.project_id = project.id')
      .where('task.id = :id', { id })
      .andWhere('project.org_id = :org_id', { org_id })
      .select('task.*')
      .getRawOne();

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return { success: true, data: task };
  }

  async update(id: string, org_id: string, updateTaskDto: any) {
    const task = await this.tasksRepository
      .createQueryBuilder('task')
      .leftJoin(Project, 'project', 'task.project_id = project.id')
      .where('task.id = :id', { id })
      .andWhere('project.org_id = :org_id', { org_id })
      .select('task.*')
      .getRawOne();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.update(id, updateTaskDto);
    const updated = await this.tasksRepository.findOne({ where: { id } });
    return { success: true, data: updated };
  }

  async remove(id: string, org_id: string) {
    const task = await this.tasksRepository
      .createQueryBuilder('task')
      .leftJoin(Project, 'project', 'task.project_id = project.id')
      .where('task.id = :id', { id })
      .andWhere('project.org_id = :org_id', { org_id })
      .select('task.*')
      .getRawOne();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.delete(id);
    return { success: true, message: 'Task deleted successfully' };
  }
}
