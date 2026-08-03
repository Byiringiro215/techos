import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Project } from '../../entities/project.entity';
import { Sprint } from '../../entities/sprint.entity';
import { Task } from '../../entities/task.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Sprint)
    private sprintsRepository: Repository<Sprint>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(org_id: string, user_id: string, createProjectDto: CreateProjectDto) {
    const project = this.projectsRepository.create({
      id: randomUUID(),
      org_id,
      ...createProjectDto,
      created_by: user_id,
      status: 'active',
    });

    await this.projectsRepository.save(project);

    return {
      success: true,
      data: project,
    };
  }

  async findAll(org_id: string, status?: string) {
    const where: any = { org_id };
    if (status) {
      where.status = status;
    }

    const projects = await this.projectsRepository.find({ where });

    // Get counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await this.tasksRepository.count({
          where: { project_id: project.id },
        });
        const sprintCount = await this.sprintsRepository.count({
          where: { project_id: project.id },
        });

        return {
          ...project,
          task_count: taskCount,
          sprint_count: sprintCount,
        };
      }),
    );

    return {
      success: true,
      data: projectsWithCounts,
    };
  }

  async findOne(id: string, org_id: string) {
    const project = await this.projectsRepository.findOne({
      where: { id, org_id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Get sprints and tasks
    const sprints = await this.sprintsRepository.find({
      where: { project_id: id },
    });

    const tasks = await this.tasksRepository.find({
      where: { project_id: id },
    });

    return {
      success: true,
      data: {
        ...project,
        sprints,
        tasks,
      },
    };
  }

  async update(id: string, org_id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectsRepository.findOne({
      where: { id, org_id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    Object.assign(project, updateProjectDto);
    await this.projectsRepository.save(project);

    return {
      success: true,
      data: project,
    };
  }

  async remove(id: string, org_id: string) {
    const project = await this.projectsRepository.findOne({
      where: { id, org_id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectsRepository.remove(project);

    return {
      success: true,
      message: 'Project deleted successfully',
    };
  }

  async getProjectStats(id: string, org_id: string) {
    const project = await this.projectsRepository.findOne({
      where: { id, org_id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const tasks = await this.tasksRepository.find({
      where: { project_id: id },
    });

    const stats = {
      total_tasks: tasks.length,
      completed_tasks: tasks.filter((t) => t.status === 'done').length,
      in_progress_tasks: tasks.filter((t) => t.status === 'in-progress').length,
      todo_tasks: tasks.filter((t) => t.status === 'todo').length,
      total_estimated_hours: tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0),
      total_logged_hours: tasks.reduce((sum, t) => sum + (t.time_logged || 0), 0),
    };

    return {
      success: true,
      data: stats,
    };
  }
}
