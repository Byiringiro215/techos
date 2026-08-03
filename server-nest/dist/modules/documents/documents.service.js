"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const document_entity_1 = require("../../entities/document.entity");
const user_entity_1 = require("../../entities/user.entity");
const cloudinary_service_1 = require("../../common/services/cloudinary.service");
let DocumentsService = class DocumentsService {
    documentsRepository;
    usersRepository;
    cloudinaryService;
    constructor(documentsRepository, usersRepository, cloudinaryService) {
        this.documentsRepository = documentsRepository;
        this.usersRepository = usersRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async create(org_id, user_id, createDocumentDto) {
        const document = this.documentsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createDocumentDto,
            created_by: user_id,
            type: createDocumentDto.type || 'general',
            version: 1,
        });
        await this.documentsRepository.save(document);
        return {
            success: true,
            data: document,
        };
    }
    async uploadFile(org_id, user_id, file, metadata) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, `techos/${org_id}/documents`);
        const document = this.documentsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            title: metadata?.title || file.originalname,
            content: uploadResult.secure_url,
            type: 'file',
            folder: metadata?.folder,
            tags: metadata?.tags,
            created_by: user_id,
            version: 1,
        });
        await this.documentsRepository.save(document);
        return {
            success: true,
            data: {
                ...document,
                file_url: uploadResult.secure_url,
                file_type: file.mimetype,
                file_size: file.size,
            },
        };
    }
    async findAll(org_id, filters) {
        const where = { org_id, is_archived: false };
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.folder) {
            where.folder = filters.folder;
        }
        const documents = await this.documentsRepository
            .createQueryBuilder('document')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'document.created_by = user.id')
            .where('document.org_id = :org_id', { org_id })
            .andWhere('document.is_archived = :is_archived', { is_archived: false })
            .andWhere(filters?.type ? 'document.type = :type' : '1=1', filters?.type ? { type: filters.type } : {})
            .andWhere(filters?.folder ? 'document.folder = :folder' : '1=1', filters?.folder ? { folder: filters.folder } : {})
            .select([
            'document.*',
            'user.first_name as created_by_first_name',
            'user.last_name as created_by_last_name',
        ])
            .orderBy('document.created_at', 'DESC')
            .getRawMany();
        return {
            success: true,
            data: documents,
        };
    }
    async findOne(id, org_id) {
        const document = await this.documentsRepository
            .createQueryBuilder('document')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'document.created_by = user.id')
            .where('document.id = :id', { id })
            .andWhere('document.org_id = :org_id', { org_id })
            .select([
            'document.*',
            'user.first_name as created_by_first_name',
            'user.last_name as created_by_last_name',
        ])
            .getRawOne();
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        return {
            success: true,
            data: document,
        };
    }
    async update(id, org_id, updateData) {
        const document = await this.documentsRepository.findOne({
            where: { id, org_id },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        Object.assign(document, updateData);
        await this.documentsRepository.save(document);
        return {
            success: true,
            data: document,
        };
    }
    async remove(id, org_id) {
        const document = await this.documentsRepository.findOne({
            where: { id, org_id },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        await this.documentsRepository.remove(document);
        return {
            success: true,
            message: 'Document deleted successfully',
        };
    }
    async archive(id, org_id) {
        const document = await this.documentsRepository.findOne({
            where: { id, org_id },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        document.is_archived = true;
        await this.documentsRepository.save(document);
        return {
            success: true,
            message: 'Document archived successfully',
        };
    }
    async search(org_id, query) {
        const documents = await this.documentsRepository
            .createQueryBuilder('document')
            .where('document.org_id = :org_id', { org_id })
            .andWhere('document.is_archived = :is_archived', { is_archived: false })
            .andWhere('(document.title LIKE :query OR document.content LIKE :query OR document.tags LIKE :query)', { query: `%${query}%` })
            .orderBy('document.updated_at', 'DESC')
            .limit(50)
            .getMany();
        return {
            success: true,
            data: documents,
        };
    }
    async getFolders(org_id) {
        const folders = await this.documentsRepository
            .createQueryBuilder('document')
            .select('document.folder', 'folder')
            .addSelect('COUNT(*)', 'document_count')
            .where('document.org_id = :org_id', { org_id })
            .andWhere('document.folder IS NOT NULL')
            .andWhere('document.is_archived = :is_archived', { is_archived: false })
            .groupBy('document.folder')
            .getRawMany();
        return {
            success: true,
            data: folders,
        };
    }
    async createVersion(id, org_id, user_id, content) {
        const document = await this.documentsRepository.findOne({
            where: { id, org_id },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        const newVersion = this.documentsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            title: `${document.title} (v${document.version + 1})`,
            content,
            type: document.type,
            folder: document.folder,
            tags: document.tags,
            created_by: user_id,
            version: document.version + 1,
        });
        await this.documentsRepository.save(newVersion);
        document.version += 1;
        await this.documentsRepository.save(document);
        return {
            success: true,
            data: newVersion,
        };
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map