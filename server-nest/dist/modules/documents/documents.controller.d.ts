import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
export declare class DocumentsController {
    private documentsService;
    constructor(documentsService: DocumentsService);
    create(user: any, createDocumentDto: CreateDocumentDto): Promise<{
        success: boolean;
        data: import("../../entities").Document;
    }>;
    uploadFile(user: any, file: Express.Multer.File, metadata?: any): Promise<{
        success: boolean;
        data: {
            file_url: any;
            file_type: string;
            file_size: number;
            id: string;
            org_id: string;
            title: string;
            content: string;
            type: string;
            folder: string;
            tags: string[];
            created_by: string;
            version: number;
            is_archived: boolean;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    findAll(user: any, filters: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    search(user: any, query: string): Promise<{
        success: boolean;
        data: import("../../entities").Document[];
    }>;
    getFolders(user: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: any;
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
}
