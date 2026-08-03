import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
export declare class TasksService {
    private tasksRepository;
    private projectsRepository;
    constructor(tasksRepository: Repository<Task>, projectsRepository: Repository<Project>);
    create(org_id: string, user_id: string, createTaskDto: any): Promise<{
        success: boolean;
        data: Task[];
    }>;
    findAll(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: string, org_id: string, updateTaskDto: any): Promise<{
        success: boolean;
        data: Task | null;
    }>;
    remove(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
