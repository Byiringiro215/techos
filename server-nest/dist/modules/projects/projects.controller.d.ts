import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private projectsService;
    constructor(projectsService: ProjectsService);
    create(user: any, createProjectDto: CreateProjectDto): Promise<{
        success: boolean;
        data: {
            client_name: any;
            owner_name: any;
            progress: number;
            id: string;
            org_id: string;
            name: string;
            description: string;
            status: string;
            priority: string;
            start_date: string;
            end_date: string;
            budget: number;
            created_by: string;
            metadata: any;
            created_at: Date;
            organization: import("../../entities").Organization;
            sprints: import("../../entities").Sprint[];
            tasks: import("../../entities").Task[];
        };
    }>;
    findAll(user: any, status?: string): Promise<{
        success: boolean;
        data: {
            task_count: number;
            sprint_count: number;
            client_name: any;
            owner_name: any;
            progress: number;
            id: string;
            org_id: string;
            name: string;
            description: string;
            status: string;
            priority: string;
            start_date: string;
            end_date: string;
            budget: number;
            created_by: string;
            metadata: any;
            created_at: Date;
            organization: import("../../entities").Organization;
            sprints: import("../../entities").Sprint[];
            tasks: import("../../entities").Task[];
        }[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: {
            sprints: import("../../entities").Sprint[];
            tasks: import("../../entities").Task[];
            client_name: any;
            owner_name: any;
            progress: number;
            id: string;
            org_id: string;
            name: string;
            description: string;
            status: string;
            priority: string;
            start_date: string;
            end_date: string;
            budget: number;
            created_by: string;
            metadata: any;
            created_at: Date;
            organization: import("../../entities").Organization;
        };
    }>;
    update(user: any, id: string, updateProjectDto: UpdateProjectDto): Promise<{
        success: boolean;
        data: {
            client_name: any;
            owner_name: any;
            progress: number;
            id: string;
            org_id: string;
            name: string;
            description: string;
            status: string;
            priority: string;
            start_date: string;
            end_date: string;
            budget: number;
            created_by: string;
            metadata: any;
            created_at: Date;
            organization: import("../../entities").Organization;
            sprints: import("../../entities").Sprint[];
            tasks: import("../../entities").Task[];
        };
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getStats(user: any, id: string): Promise<{
        success: boolean;
        data: {
            total_tasks: number;
            completed_tasks: number;
            in_progress_tasks: number;
            todo_tasks: number;
            total_estimated_hours: number;
            total_logged_hours: number;
        };
    }>;
    getStatistics(user: any, id: string): Promise<{
        success: boolean;
        data: {
            total_tasks: number;
            completed_tasks: number;
            in_progress_tasks: number;
            todo_tasks: number;
            total_estimated_hours: number;
            total_logged_hours: number;
        };
    }>;
}
