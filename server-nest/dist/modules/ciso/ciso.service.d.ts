import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { Report } from '../../entities/report.entity';
export declare class CisoService {
    private tasksRepository;
    private projectsRepository;
    private reportsRepository;
    constructor(tasksRepository: Repository<Task>, projectsRepository: Repository<Project>, reportsRepository: Repository<Report>);
    getTasks(org_id: string, status?: 'finished' | 'not_finished'): Promise<{
        success: boolean;
        data: {
            finished: boolean;
            id: string;
            org_id: string;
            project_id: string;
            sprint_id: string;
            parent_task_id: string;
            title: string;
            description: string;
            status: string;
            priority: string;
            assignee_id: string;
            assignee_ids: string[];
            reporter_id: string;
            estimated_hours: number;
            time_logged: number;
            story_points: number;
            due_date: string;
            dependencies: string[];
            tags: string[];
            created_at: Date;
            project: Project;
            sprint: import("../../entities").Sprint;
        }[];
    }>;
    updateTaskStatus(org_id: string, task_id: string, finished: boolean): Promise<{
        success: boolean;
        data: {
            finished: boolean;
            id: string;
            org_id: string;
            project_id: string;
            sprint_id: string;
            parent_task_id: string;
            title: string;
            description: string;
            status: string;
            priority: string;
            assignee_id: string;
            assignee_ids: string[];
            reporter_id: string;
            estimated_hours: number;
            time_logged: number;
            story_points: number;
            due_date: string;
            dependencies: string[];
            tags: string[];
            created_at: Date;
            project: Project;
            sprint: import("../../entities").Sprint;
        };
    }>;
    getAuditProjects(org_id: string, status?: 'needed' | 'in_progress' | 'completed'): Promise<{
        success: boolean;
        data: {
            audit_required: boolean;
            audit_status: string;
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
            visible_to_roles: string[] | null;
            metadata: any;
            created_at: Date;
            organization: import("../../entities").Organization;
            sprints: import("../../entities").Sprint[];
            tasks: Task[];
        }[];
    }>;
    updateAuditStatus(org_id: string, project_id: string, audit_status: 'needed' | 'in_progress' | 'completed'): Promise<{
        success: boolean;
        data: Project;
    }>;
    getReports(org_id: string): Promise<{
        success: boolean;
        data: Report[];
    }>;
    createReport(org_id: string, user_id: string, payload: {
        title: string;
        summary?: string;
        type?: string;
    }): Promise<{
        success: boolean;
        data: Report;
    }>;
}
