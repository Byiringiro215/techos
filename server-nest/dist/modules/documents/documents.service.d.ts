import { Repository } from 'typeorm';
import { Document } from '../../entities/document.entity';
import { User } from '../../entities/user.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CloudinaryService } from '../../common/services/cloudinary.service';
export declare class DocumentsService {
    private documentsRepository;
    private usersRepository;
    private cloudinaryService;
    private readonly uploadsRoot;
    constructor(documentsRepository: Repository<Document>, usersRepository: Repository<User>, cloudinaryService: CloudinaryService);
    private ensureDir;
    private saveLocalFile;
    private toFileDto;
    create(org_id: string, user_id: string, createDocumentDto: CreateDocumentDto): Promise<{
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
    uploadFile(org_id: string, user_id: string, file: Express.Multer.File, metadata?: any): Promise<{
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
    attachFile(id: string, org_id: string, file: Express.Multer.File): Promise<{
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
    resolveFile(id: string, org_id: string): Promise<{
        kind: "local";
        stream: import("fs").ReadStream;
        mime: string;
        filename: string;
        size: number | undefined;
        url?: undefined;
    } | {
        kind: "remote";
        url: string;
        mime: string;
        filename: string;
        stream?: undefined;
        size?: undefined;
    }>;
    findAll(org_id: string, filters?: any): Promise<{
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
    findOne(id: string, org_id: string): Promise<{
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
    update(id: string, org_id: string, updateData: Partial<Document>): Promise<{
        success: boolean;
        data: Document;
    }>;
    remove(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    archive(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    search(org_id: string, query: string): Promise<{
        success: boolean;
        data: Document[];
    }>;
    getFolders(org_id: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    createVersion(id: string, org_id: string, user_id: string, content: string): Promise<{
        success: boolean;
        data: Document;
    }>;
    getVersions(id: string, org_id: string): Promise<{
        success: boolean;
        data: Document[];
    }>;
    createFolder(org_id: string, user_id: string, folderData: {
        name: string;
        parent_folder_id?: string;
    }): Promise<{
        success: boolean;
        data: {
            name: string;
        };
    }>;
}
