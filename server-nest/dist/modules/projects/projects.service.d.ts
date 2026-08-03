import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Sprint } from '../../entities/sprint.entity';
import { Task } from '../../entities/task.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private projectsRepository;
    private sprintsRepository;
    private tasksRepository;
    constructor(projectsRepository: Repository<Project>, sprintsRepository: Repository<Sprint>, tasksRepository: Repository<Task>);
    create(org_id: string, user_id: string, createProjectDto: CreateProjectDto): Promise<{
        success: boolean;
        data: Project;
    }>;
    findAll(org_id: string, status?: string): Promise<{
        success: boolean;
        data: {
            task_count: number;
            sprint_count: number;
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
            sprints: Sprint[];
            tasks: Task[];
        }[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: {
            sprints: Sprint[];
            tasks: Task[];
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
    update(id: string, org_id: string, updateProjectDto: UpdateProjectDto): Promise<{
        success: boolean;
        data: Project;
    }>;
    remove(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getProjectStats(id: string, org_id: string): Promise<{
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
