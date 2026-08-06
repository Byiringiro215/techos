import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { ActivityLogService } from '../../common/services/activity-log.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private activityLogService: ActivityLogService,
  ) {}

  async create(org_id: string, actor: any, createTaskDto: any) {
    // Verify project belongs to org
    const project = await this.projectsRepository.findOne({
      where: { id: createTaskDto.project_id, org_id },
    });
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const task = this.tasksRepository.create({
      id: randomUUID(),
      org_id,
      title: createTaskDto.title,
      description: createTaskDto.description,
      project_id: createTaskDto.project_id,
      sprint_id: createTaskDto.sprint_id,
      parent_task_id: createTaskDto.parent_task_id,
      status: createTaskDto.status || 'todo',
      priority: createTaskDto.priority || 'medium',
      assignee_id: createTaskDto.assignee_id,
      estimated_hours: createTaskDto.estimated_hours,
      story_points: createTaskDto.story_points,
      due_date: createTaskDto.due_date,
      tags: createTaskDto.tags,
      reporter_id: actor?.id,
    });

    const saved = await this.tasksRepository.save(task);
    await this.activityLogService.log({
      org_id,
      actor,
      action: 'created',
      resource_type: 'tasks',
      resource_id: saved.id,
      summary: `created task "${saved.title || 'Untitled'}"`,
    });
    return { success: true, data: saved };
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

  async update(id: string, org_id: string, updateTaskDto: any, actor?: any) {
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
    await this.activityLogService.log({
      org_id,
      actor,
      action: 'updated',
      resource_type: 'tasks',
      resource_id: id,
      summary: `updated task "${updated?.title || task.title || 'Untitled'}"`,
      changes: updateTaskDto,
    });
    return { success: true, data: updated };
  }

  async remove(id: string, org_id: string, actor?: any) {
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
    await this.activityLogService.log({
      org_id,
      actor,
      action: 'deleted',
      resource_type: 'tasks',
      resource_id: id,
      summary: `deleted task "${task.title || 'Untitled'}"`,
    });
    return { success: true, message: 'Task deleted successfully' };
  }

  async getSubtasks(task_id: string, org_id: string) {
    await this.findOne(task_id, org_id);
    const subtasks = await this.tasksRepository.find({
      where: { parent_task_id: task_id },
      order: { created_at: 'ASC' },
    });
    return { success: true, data: subtasks };
  }
}
