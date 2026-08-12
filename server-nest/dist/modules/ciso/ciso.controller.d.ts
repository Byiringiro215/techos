import { CisoService } from './ciso.service';
import { GetCisoTasksQueryDto } from './dto/get-ciso-tasks-query.dto';
import { UpdateCisoTaskStatusDto } from './dto/update-ciso-task-status.dto';
import { GetCisoAuditProjectsQueryDto } from './dto/get-ciso-audit-projects-query.dto';
import { UpdateCisoAuditStatusDto } from './dto/update-ciso-audit-status.dto';
import { CreateCisoReportDto } from './dto/create-ciso-report.dto';
export declare class CisoController {
    private cisoService;
    constructor(cisoService: CisoService);
    private ensureCisoAccess;
    getTasks(user: any, query: GetCisoTasksQueryDto): Promise<{
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
            project: import("../../entities").Project;
            sprint: import("../../entities").Sprint;
        }[];
    }>;
    updateTaskStatus(user: any, id: string, body: UpdateCisoTaskStatusDto): Promise<{
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
            project: import("../../entities").Project;
            sprint: import("../../entities").Sprint;
        };
    }>;
    getAuditProjects(user: any, query: GetCisoAuditProjectsQueryDto): Promise<{
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
            tasks: import("../../entities").Task[];
        }[];
    }>;
    updateAuditStatus(user: any, id: string, body: UpdateCisoAuditStatusDto): Promise<{
        success: boolean;
        data: import("../../entities").Project;
    }>;
    getReports(user: any): Promise<{
        success: boolean;
        data: import("../../entities").Report[];
    }>;
    createReport(user: any, body: CreateCisoReportDto): Promise<{
        success: boolean;
        data: import("../../entities").Report;
    }>;
}
