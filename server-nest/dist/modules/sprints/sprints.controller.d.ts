import { SprintsService } from './sprints.service';
export declare class SprintsController {
    private sprintsService;
    constructor(sprintsService: SprintsService);
    create(user: any, createSprintDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Sprint[];
    }>;
    findAll(user: any, project_id?: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getStats(user: any, id: string): Promise<{
        success: boolean;
        data: {
            total_tasks: number;
            completed_tasks: number;
            completion_rate: number;
        };
    }>;
    getActive(user: any, projectId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(user: any, id: string, updateSprintDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Sprint | null;
    }>;
    start(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Sprint;
    }>;
    complete(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Sprint;
    }>;
    addTask(user: any, sprintId: string, taskId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeTask(user: any, sprintId: string, taskId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
