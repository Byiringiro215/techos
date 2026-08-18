import { Repository } from 'typeorm';
import { ProjectAudit } from '../../entities/project-audit.entity';
import { AuditTask } from '../../entities/audit-task.entity';
import { Report } from '../../entities/report.entity';
import { CreateProjectAuditDto } from './dto/create-project-audit.dto';
import { UpdateProjectAuditDto } from './dto/update-project-audit.dto';
import { CreateAuditTaskDto } from './dto/create-audit-task.dto';
import { UpdateAuditTaskDto } from './dto/update-audit-task.dto';
export declare class CisoService {
    private auditsRepository;
    private auditTasksRepository;
    private reportsRepository;
    constructor(auditsRepository: Repository<ProjectAudit>, auditTasksRepository: Repository<AuditTask>, reportsRepository: Repository<Report>);
    private mapAudit;
    private mapTask;
    createAudit(org_id: string, user_id: string, dto: CreateProjectAuditDto): Promise<{
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
            tasks: AuditTask[];
        };
    }>;
    getAudits(org_id: string, status?: 'needed' | 'in_progress' | 'completed'): Promise<{
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
            tasks: AuditTask[];
        }[];
    }>;
    getAudit(org_id: string, id: string): Promise<{
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
            tasks: AuditTask[];
        };
    }>;
    updateAudit(org_id: string, id: string, dto: UpdateProjectAuditDto): Promise<{
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
            tasks: AuditTask[];
        };
    }>;
    deleteAudit(org_id: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createAuditTask(org_id: string, user_id: string, dto: CreateAuditTaskDto): Promise<{
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
            audit: ProjectAudit;
        };
    }>;
    getAuditTasks(org_id: string, filters?: {
        project_audit_id?: string;
        status?: 'finished' | 'not_finished';
    }): Promise<{
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
            audit: ProjectAudit;
        }[];
    }>;
    updateAuditTask(org_id: string, id: string, dto: UpdateAuditTaskDto): Promise<{
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
            audit: ProjectAudit;
        };
    }>;
    updateAuditTaskStatus(org_id: string, id: string, finished: boolean): Promise<{
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
            audit: ProjectAudit;
        };
    }>;
    deleteAuditTask(org_id: string, id: string): Promise<{
        success: boolean;
        message: string;
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
