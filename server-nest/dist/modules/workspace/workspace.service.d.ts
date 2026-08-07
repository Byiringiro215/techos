import { Repository } from 'typeorm';
import { WorkspaceRecord } from '../../entities/workspace-record.entity';
import { ActivityEvent } from '../../entities/activity-event.entity';
import { RecordComment } from '../../entities/record-comment.entity';
import { CreateWorkspaceRecordDto } from './dto/create-workspace-record.dto';
import { CreateRecordCommentDto } from './dto/create-record-comment.dto';
import { ActivityLogService } from '../../common/services/activity-log.service';
export declare class WorkspaceService {
    private recordsRepository;
    private activityRepository;
    private commentsRepository;
    private activityLogService;
    constructor(recordsRepository: Repository<WorkspaceRecord>, activityRepository: Repository<ActivityEvent>, commentsRepository: Repository<RecordComment>, activityLogService: ActivityLogService);
    private isTeamMember;
    list(org_id: string, type: string, user?: {
        id?: string;
        role?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            org_id: string;
            type: string;
            title: string;
            name: string;
            description: string;
            status: string;
            statusVariant: string;
            priority: string;
            owner: string;
            amount: number;
            dueDate: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: Record<string, any>;
        }[];
    }>;
    get(org_id: string, type: string, id: string, user?: {
        id?: string;
        role?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            org_id: string;
            type: string;
            title: string;
            name: string;
            description: string;
            status: string;
            statusVariant: string;
            priority: string;
            owner: string;
            amount: number;
            dueDate: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: Record<string, any>;
        };
    }>;
    create(org_id: string, type: string, actor: any, dto: CreateWorkspaceRecordDto): Promise<{
        success: boolean;
        data: {
            id: string;
            org_id: string;
            type: string;
            title: string;
            name: string;
            description: string;
            status: string;
            statusVariant: string;
            priority: string;
            owner: string;
            amount: number;
            dueDate: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: Record<string, any>;
        };
    }>;
    update(org_id: string, type: string, id: string, actor: any, dto: Partial<CreateWorkspaceRecordDto>): Promise<{
        success: boolean;
        data: {
            id: string;
            org_id: string;
            type: string;
            title: string;
            name: string;
            description: string;
            status: string;
            statusVariant: string;
            priority: string;
            owner: string;
            amount: number;
            dueDate: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: Record<string, any>;
        };
    }>;
    remove(org_id: string, type: string, id: string, actor: any): Promise<{
        success: boolean;
        message: string;
    }>;
    listComments(org_id: string, entity_type: string, entity_id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            entity_type: string;
            entity_id: string;
            body: string;
            author_id: string;
            author_name: string;
            created_at: Date;
            updated_at: Date;
        }[];
    }>;
    createComment(org_id: string, actor: any, dto: CreateRecordCommentDto): Promise<{
        success: boolean;
        data: {
            id: string;
            entity_type: string;
            entity_id: string;
            body: string;
            author_id: string;
            author_name: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    removeComment(org_id: string, id: string, actor: any): Promise<{
        success: boolean;
        message: string;
    }>;
    listActivity(org_id: string, entity_type?: string, entity_id?: string, actor_id?: string): Promise<{
        success: boolean;
        data: ActivityEvent[];
    }>;
    recordActivity(org_id: string, entity_type: string, entity_id: string, action: string, summary: string, actor: any): Promise<void>;
    private activitySummary;
    private humanizeEntityType;
    private toUi;
    private statusVariant;
}
