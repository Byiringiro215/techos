import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<any>;
    uploadImage(file: Express.Multer.File, folder?: string): Promise<string>;
    deleteFile(publicId: string): Promise<any>;
    uploadMultiple(files: Express.Multer.File[], folder?: string): Promise<string[]>;
}
