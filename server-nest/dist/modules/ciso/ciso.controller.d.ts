import { CisoService } from './ciso.service';
import { CreateCisoReportDto } from './dto/create-ciso-report.dto';
import { CreateProjectAuditDto } from './dto/create-project-audit.dto';
import { UpdateProjectAuditDto } from './dto/update-project-audit.dto';
import { GetCisoAuditProjectsQueryDto } from './dto/get-ciso-audit-projects-query.dto';
import { CreateAuditTaskDto } from './dto/create-audit-task.dto';
import { UpdateAuditTaskDto } from './dto/update-audit-task.dto';
import { GetAuditTasksQueryDto } from './dto/get-audit-tasks-query.dto';
import { UpdateCisoTaskStatusDto } from './dto/update-ciso-task-status.dto';
export declare class CisoController {
    private cisoService;
    constructor(cisoService: CisoService);
    private ensureCisoAccess;
    createAudit(user: any, body: CreateProjectAuditDto): Promise<{
        success: boolean;
        data: {
            task_count: number;
            id: string;
            org_id: string;
            name: string;
            description: string | null;
            status: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            tasks: import("../../entities").AuditTask[];
        };
    }>;
    getAudits(user: any, query: GetCisoAuditProjectsQueryDto): Promise<{
        success: boolean;
        data: {
            task_count: number;
            id: string;
            org_id: string;
            name: string;
            description: string | null;
            status: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            tasks: import("../../entities").AuditTask[];
        }[];
    }>;
    getAudit(user: any, id: string): Promise<{
        success: boolean;
        data: {
            task_count: number;
            id: string;
            org_id: string;
            name: string;
            description: string | null;
            status: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            tasks: import("../../entities").AuditTask[];
        };
    }>;
    updateAudit(user: any, id: string, body: UpdateProjectAuditDto): Promise<{
        success: boolean;
        data: {
            task_count: number;
            id: string;
            org_id: string;
            name: string;
            description: string | null;
            status: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            tasks: import("../../entities").AuditTask[];
        };
    }>;
    deleteAudit(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createAuditTask(user: any, body: CreateAuditTaskDto): Promise<{
        success: boolean;
        data: {
            finished: boolean;
            audit_name: string | null;
            id: string;
            org_id: string;
            project_audit_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            audit: import("../../entities").ProjectAudit;
        };
    }>;
    getAuditTasks(user: any, query: GetAuditTasksQueryDto): Promise<{
        success: boolean;
        data: {
            finished: boolean;
            audit_name: string | null;
            id: string;
            org_id: string;
            project_audit_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            audit: import("../../entities").ProjectAudit;
        }[];
    }>;
    updateAuditTask(user: any, id: string, body: UpdateAuditTaskDto): Promise<{
        success: boolean;
        data: {
            finished: boolean;
            audit_name: string | null;
            id: string;
            org_id: string;
            project_audit_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            audit: import("../../entities").ProjectAudit;
        };
    }>;
    updateAuditTaskStatus(user: any, id: string, body: UpdateCisoTaskStatusDto): Promise<{
        success: boolean;
        data: {
            finished: boolean;
            audit_name: string | null;
            id: string;
            org_id: string;
            project_audit_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            audit: import("../../entities").ProjectAudit;
        };
    }>;
    deleteAuditTask(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getTasks(user: any, query: GetAuditTasksQueryDto): Promise<{
        success: boolean;
        data: {
            finished: boolean;
            audit_name: string | null;
            id: string;
            org_id: string;
            project_audit_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            audit: import("../../entities").ProjectAudit;
        }[];
    }>;
    updateTaskStatus(user: any, id: string, body: UpdateCisoTaskStatusDto): Promise<{
        success: boolean;
        data: {
            finished: boolean;
            audit_name: string | null;
            id: string;
            org_id: string;
            project_audit_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            audit: import("../../entities").ProjectAudit;
        };
    }>;
    getAuditProjects(user: any, query: GetCisoAuditProjectsQueryDto): Promise<{
        success: boolean;
        data: {
            task_count: number;
            id: string;
            org_id: string;
            name: string;
            description: string | null;
            status: string;
            created_by: string | null;
            created_at: Date;
            updated_at: Date;
            tasks: import("../../entities").AuditTask[];
        }[];
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
