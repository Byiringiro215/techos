import { Repository } from 'typeorm';
import { Document } from '../../entities/document.entity';
import { User } from '../../entities/user.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CloudinaryService } from '../../common/services/cloudinary.service';
export declare class DocumentsService {
    private documentsRepository;
    private usersRepository;
    private cloudinaryService;
    constructor(documentsRepository: Repository<Document>, usersRepository: Repository<User>, cloudinaryService: CloudinaryService);
    create(org_id: string, user_id: string, createDocumentDto: CreateDocumentDto): Promise<{
        success: boolean;
        data: Document;
    }>;
    uploadFile(org_id: string, user_id: string, file: Express.Multer.File, metadata?: any): Promise<{
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
    findAll(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: any;
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
}
