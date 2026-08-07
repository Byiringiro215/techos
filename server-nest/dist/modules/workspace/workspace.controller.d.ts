import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceRecordDto } from './dto/create-workspace-record.dto';
import { CreateRecordCommentDto } from './dto/create-record-comment.dto';
export declare class WorkspaceController {
    private workspaceService;
    constructor(workspaceService: WorkspaceService);
    listActivity(user: any, entity_type?: string, entity_id?: string, actor_id?: string): Promise<{
        success: boolean;
        data: import("../../entities").ActivityEvent[];
    }>;
    listComments(user: any, entity_type: string, entity_id: string): Promise<{
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
    createComment(user: any, dto: CreateRecordCommentDto): Promise<{
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
    removeComment(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    list(user: any, type: string): Promise<{
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
    get(user: any, type: string, id: string): Promise<{
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
    create(user: any, type: string, dto: CreateWorkspaceRecordDto): Promise<{
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
    update(user: any, type: string, id: string, dto: CreateWorkspaceRecordDto): Promise<{
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
    remove(user: any, type: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
