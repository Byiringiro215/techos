import type { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
export declare class DocumentsController {
    private documentsService;
    constructor(documentsService: DocumentsService);
    create(user: any, createDocumentDto: CreateDocumentDto): Promise<{
        success: boolean;
        data: {
            file_url: string;
            file_type: string | undefined;
            file_size: number | undefined;
            can_view: boolean;
            id: string;
            org_id: string;
            title: string;
            content: string;
            type: string;
            folder: string;
            tags: string[];
            storage_path: string | null;
            file_mime: string | null;
            created_by: string;
            version: number;
            is_archived: boolean;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    uploadFile(user: any, file: Express.Multer.File, metadata?: any): Promise<{
        success: boolean;
        data: {
            file_url: string;
            file_type: string | undefined;
            file_size: number | undefined;
            can_view: boolean;
            id: string;
            org_id: string;
            title: string;
            content: string;
            type: string;
            folder: string;
            tags: string[];
            storage_path: string | null;
            file_mime: string | null;
            created_by: string;
            version: number;
            is_archived: boolean;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    attachFile(user: any, id: string, file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            file_url: string;
            file_type: string | undefined;
            file_size: number | undefined;
            can_view: boolean;
            id: string;
            org_id: string;
            title: string;
            content: string;
            type: string;
            folder: string;
            tags: string[];
            storage_path: string | null;
            file_mime: string | null;
            created_by: string;
            version: number;
            is_archived: boolean;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    findAll(user: any, filters: any): Promise<{
        success: boolean;
        data: {
            created_by_name: string | null;
            owner: string;
            file_url: string;
            file_type: string | undefined;
            file_size: number | undefined;
            can_view: boolean;
            id: string;
            org_id: string;
            title: string;
            content: string;
            type: string;
            folder: string;
            tags: string[];
            storage_path: string | null;
            file_mime: string | null;
            created_by: string;
            version: number;
            is_archived: boolean;
            created_at: Date;
            updated_at: Date;
        }[];
    }>;
    search(user: any, query: string): Promise<{
        success: boolean;
        data: import("../../entities").Document[];
    }>;
    getFolders(user: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    createFolder(user: any, body: {
        name: string;
        parent_folder_id?: string;
    }): Promise<{
        success: boolean;
        data: {
            name: string;
        };
    }>;
    getFile(user: any, id: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: {
            created_by_first_name: string | null;
            created_by_last_name: string | null;
            created_by_name: string | null;
            owner: string;
            file_url: string;
            file_type: string | undefined;
            file_size: number | undefined;
            can_view: boolean;
            id: string;
            org_id: string;
            title: string;
            content: string;
            type: string;
            folder: string;
            tags: string[];
            storage_path: string | null;
            file_mime: string | null;
            created_by: string;
            version: number;
            is_archived: boolean;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    update(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").Document;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    archive(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createVersion(user: any, id: string, body: {
        content: string;
    }): Promise<{
        success: boolean;
        data: import("../../entities").Document;
    }>;
    getVersions(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Document[];
    }>;
}
