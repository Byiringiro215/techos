import { TasksService } from './tasks.service';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    create(user: any, createTaskDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Task;
    }>;
    findAll(user: any, filters: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getSubtasks(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Task[];
    }>;
    update(user: any, id: string, updateTaskDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Task | null;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
