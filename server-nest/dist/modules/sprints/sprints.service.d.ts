import { Repository } from 'typeorm';
import { Sprint } from '../../entities/sprint.entity';
import { Project } from '../../entities/project.entity';
import { Task } from '../../entities/task.entity';
import { ProjectViewer } from '../../common/utils/project-visibility';
export declare class SprintsService {
    private sprintsRepository;
    private projectsRepository;
    private tasksRepository;
    constructor(sprintsRepository: Repository<Sprint>, projectsRepository: Repository<Project>, tasksRepository: Repository<Task>);
    private getAccessibleProjectIds;
    private assertProjectAccess;
    create(org_id: string, createSprintDto: any, user?: ProjectViewer): Promise<{
        success: boolean;
        data: Sprint;
    }>;
    findAll(org_id: string, project_id?: string, user?: ProjectViewer): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(id: string, org_id: string, user?: ProjectViewer): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: string, org_id: string, updateSprintDto: any, user?: ProjectViewer): Promise<{
        success: boolean;
        data: Sprint | null;
    }>;
    remove(id: string, org_id: string, user?: ProjectViewer): Promise<{
        success: boolean;
        message: string;
    }>;
    getStats(id: string, org_id: string, user?: ProjectViewer): Promise<{
        success: boolean;
        data: {
            total_tasks: number;
            completed_tasks: number;
            completion_rate: number;
        };
    }>;
    findActiveSprint(project_id: string, org_id: string, user?: ProjectViewer): Promise<{
        success: boolean;
        data: any;
    }>;
    startSprint(id: string, org_id: string, user?: ProjectViewer): Promise<{
        success: boolean;
        data: Sprint;
    }>;
    completeSprint(id: string, org_id: string, user?: ProjectViewer): Promise<{
        success: boolean;
        data: Sprint;
        returned_to_backlog: number;
        completed_tasks: number;
    }>;
    addTaskToSprint(sprint_id: string, task_id: string, org_id: string, user?: ProjectViewer): Promise<{
        success: boolean;
        message: string;
    }>;
    removeTaskFromSprint(sprint_id: string, task_id: string, org_id: string, user?: ProjectViewer): Promise<{
        success: boolean;
        message: string;
    }>;
}
