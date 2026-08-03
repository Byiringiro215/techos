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
    update(user: any, id: string, updateSprintDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Sprint | null;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
