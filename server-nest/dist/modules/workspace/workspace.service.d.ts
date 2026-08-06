import { Repository } from 'typeorm';
import { WorkspaceRecord } from '../../entities/workspace-record.entity';
import { ActivityEvent } from '../../entities/activity-event.entity';
import { CreateWorkspaceRecordDto } from './dto/create-workspace-record.dto';
import { ActivityLogService } from '../../common/services/activity-log.service';
export declare class WorkspaceService {
    private recordsRepository;
    private activityRepository;
    private activityLogService;
    constructor(recordsRepository: Repository<WorkspaceRecord>, activityRepository: Repository<ActivityEvent>, activityLogService: ActivityLogService);
    list(org_id: string, type: string): Promise<{
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
    get(org_id: string, type: string, id: string): Promise<{
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
