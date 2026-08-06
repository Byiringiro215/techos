import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { ActivityLogService } from '../../common/services/activity-log.service';
export declare class TasksService {
    private tasksRepository;
    private projectsRepository;
    private activityLogService;
    constructor(tasksRepository: Repository<Task>, projectsRepository: Repository<Project>, activityLogService: ActivityLogService);
    create(org_id: string, actor: any, createTaskDto: any): Promise<{
        success: boolean;
        data: Task;
    }>;
    findAll(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: string, org_id: string, updateTaskDto: any, actor?: any): Promise<{
        success: boolean;
        data: Task | null;
    }>;
    remove(id: string, org_id: string, actor?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getSubtasks(task_id: string, org_id: string): Promise<{
        success: boolean;
        data: Task[];
    }>;
}
