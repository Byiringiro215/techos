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
const fs_1 = require("fs");
const path_1 = require("path");
const document_entity_1 = require("../../entities/document.entity");
const user_entity_1 = require("../../entities/user.entity");
const cloudinary_service_1 = require("../../common/services/cloudinary.service");
let DocumentsService = class DocumentsService {
    documentsRepository;
    usersRepository;
    cloudinaryService;
    uploadsRoot = (0, path_1.join)(process.cwd(), 'uploads', 'documents');
    constructor(documentsRepository, usersRepository, cloudinaryService) {
        this.documentsRepository = documentsRepository;
        this.usersRepository = usersRepository;
        this.cloudinaryService = cloudinaryService;
    }
    ensureDir(dir) {
        if (!(0, fs_1.existsSync)(dir)) {
            (0, fs_1.mkdirSync)(dir, { recursive: true });
        }
    }
    saveLocalFile(org_id, documentId, file) {
        const orgDir = (0, path_1.join)(this.uploadsRoot, org_id);
        this.ensureDir(orgDir);
        const ext = (0, path_1.extname)(file.originalname || '') || '';
        const relative = (0, path_1.join)(org_id, `${documentId}${ext}`).replace(/\\/g, '/');
        const absolute = (0, path_1.join)(this.uploadsRoot, relative);
        (0, fs_1.writeFileSync)(absolute, file.buffer);
        return relative;
    }
    toFileDto(document) {
        const remote = typeof document.content === 'string' && /^https?:\/\//i.test(document.content)
            ? document.content
            : null;
        const can_view = Boolean(remote || document.storage_path);
        return {
            ...document,
            file_url: remote || (document.storage_path ? `/documents/${document.id}/file` : document.content),
            file_type: document.file_mime || undefined,
            file_size: document.file_size ?? undefined,
            can_view,
        };
    }
    async create(org_id, user_id, createDocumentDto) {
        const document = this.documentsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            title: createDocumentDto.title,
            content: createDocumentDto.content || '',
            type: createDocumentDto.type || 'general',
            folder: createDocumentDto.folder,
            tags: createDocumentDto.tags,
            created_by: user_id,
            version: 1,
        });
        await this.documentsRepository.save(document);
        return {
            success: true,
            data: this.toFileDto(document),
        };
    }
    async uploadFile(org_id, user_id, file, metadata) {
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const id = (0, crypto_1.randomUUID)();
        const storage_path = this.saveLocalFile(org_id, id, file);
        let fileUrl = `local://${storage_path}`;
        const fileType = file.mimetype || 'application/octet-stream';
        try {
            const uploadResult = await this.cloudinaryService.uploadFile(file, `techos/${org_id}/documents`);
            if (uploadResult?.secure_url) {
                fileUrl = uploadResult.secure_url;
            }
        }
        catch {
        }
        const relatedType = metadata?.related_entity_type || metadata?.relatedEntityType;
        const relatedId = metadata?.related_entity_id || metadata?.relatedEntityId;
        const folder = metadata?.folder ||
            (relatedType && relatedId ? `related/${relatedType}/${relatedId}` : undefined);
        const tags = [
            ...(Array.isArray(metadata?.tags) ? metadata.tags : []),
            relatedType ? `related:${relatedType}` : null,
            relatedId ? `parent:${relatedId}` : null,
        ].filter(Boolean);
        const document = this.documentsRepository.create({
            id,
            org_id,
            title: metadata?.title || file.originalname,
            content: fileUrl,
            type: metadata?.type || 'file',
            folder,
            tags,
            storage_path,
            file_mime: fileType,
            file_size: file.size,
            created_by: user_id,
            version: 1,
        });
        await this.documentsRepository.save(document);
        return {
            success: true,
            data: this.toFileDto(document),
        };
    }
    async attachFile(id, org_id, file) {
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const document = await this.documentsRepository.findOne({ where: { id, org_id } });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (document.storage_path) {
            const previous = (0, path_1.join)(this.uploadsRoot, document.storage_path);
            if ((0, fs_1.existsSync)(previous)) {
                try {
                    (0, fs_1.unlinkSync)(previous);
                }
                catch {
                }
            }
        }
        const storage_path = this.saveLocalFile(org_id, id, file);
        let fileUrl = `local://${storage_path}`;
        const fileType = file.mimetype || 'application/octet-stream';
        try {
            const uploadResult = await this.cloudinaryService.uploadFile(file, `techos/${org_id}/documents`);
            if (uploadResult?.secure_url) {
                fileUrl = uploadResult.secure_url;
            }
        }
        catch {
        }
        document.content = fileUrl;
        document.storage_path = storage_path;
        document.file_mime = fileType;
        document.file_size = file.size;
        document.type = document.type === 'folder' ? 'file' : document.type || 'file';
        if (!document.title || document.title === 'Untitled') {
            document.title = file.originalname;
        }
        document.version = (document.version || 1) + 1;
        await this.documentsRepository.save(document);
        return {
            success: true,
            data: this.toFileDto(document),
        };
    }
    async resolveFile(id, org_id) {
        const document = await this.documentsRepository.findOne({
            where: { id, org_id },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        const filename = document.title || 'file';
        const candidates = [];
        if (document.storage_path) {
            candidates.push((0, path_1.join)(this.uploadsRoot, document.storage_path));
            if (/^[a-zA-Z]:[\\/]|^\\\\|^\//.test(document.storage_path)) {
                candidates.push(document.storage_path);
            }
        }
        if (typeof document.content === 'string') {
            const localMatch = document.content.match(/^local:\/\/(.+)$/i);
            if (localMatch?.[1]) {
                candidates.push((0, path_1.join)(this.uploadsRoot, localMatch[1]));
            }
        }
        for (const absolute of candidates) {
            if (absolute && (0, fs_1.existsSync)(absolute)) {
                return {
                    kind: 'local',
                    stream: (0, fs_1.createReadStream)(absolute),
                    mime: document.file_mime || 'application/octet-stream',
                    filename,
                    size: document.file_size ?? undefined,
                };
            }
        }
        if (typeof document.content === 'string' && /^https?:\/\//i.test(document.content)) {
            return {
                kind: 'remote',
                url: document.content,
                mime: document.file_mime || 'application/octet-stream',
                filename,
            };
        }
        throw new common_1.NotFoundException('File content is not available. Upload the file again from the document page.');
    }
    async findAll(org_id, filters, user_id) {
        const where = { org_id, is_archived: false };
        if (user_id)
            where.created_by = user_id;
        if (filters?.type) {
            where.type = filters.type;
        }
        const folderFilter = filters?.folder || filters?.folder_id;
        if (folderFilter) {
            where.folder = folderFilter;
        }
        const documents = await this.documentsRepository.find({
            where,
            order: { created_at: 'DESC' },
        });
        const creatorIds = [...new Set(documents.map((d) => d.created_by).filter(Boolean))];
        const creators = creatorIds.length
            ? await this.usersRepository.find({ where: { id: (0, typeorm_2.In)(creatorIds) } })
            : [];
        const byId = Object.fromEntries(creators.map((u) => [
            u.id,
            u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || null,
        ]));
        return {
            success: true,
            data: documents.map((d) => ({
                ...this.toFileDto(d),
                created_by_name: d.created_by ? byId[d.created_by] || null : null,
                owner: d.created_by ? byId[d.created_by] || '—' : '—',
            })),
        };
    }
    async findOne(id, org_id) {
        const document = await this.documentsRepository.findOne({
            where: { id, org_id },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        let created_by_first_name = null;
        let created_by_last_name = null;
        let created_by_name = null;
        if (document.created_by) {
            const creator = await this.usersRepository.findOne({
                where: { id: document.created_by },
            });
            if (creator) {
                created_by_first_name = creator.first_name || null;
                created_by_last_name = creator.last_name || null;
                created_by_name =
                    creator.name ||
                        `${creator.first_name || ''} ${creator.last_name || ''}`.trim() ||
                        creator.email ||
                        null;
            }
        }
        return {
            success: true,
            data: {
                ...this.toFileDto(document),
                created_by_first_name,
                created_by_last_name,
                created_by_name,
                owner: created_by_name || '—',
            },
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
        if (document.storage_path) {
            const absolute = (0, path_1.join)(this.uploadsRoot, document.storage_path);
            if ((0, fs_1.existsSync)(absolute)) {
                try {
                    (0, fs_1.unlinkSync)(absolute);
                }
                catch {
                }
            }
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
    async search(org_id, query, user_id) {
        const qb = this.documentsRepository
            .createQueryBuilder('document')
            .where('document.org_id = :org_id', { org_id })
            .andWhere('document.is_archived = :is_archived', { is_archived: false });
        if (user_id) {
            qb.andWhere('document.created_by = :user_id', { user_id });
        }
        const documents = await qb
            .andWhere('(document.title LIKE :query OR document.content LIKE :query OR document.tags LIKE :query)', { query: `%${query}%` })
            .orderBy('document.updated_at', 'DESC')
            .limit(50)
            .getMany();
        return {
            success: true,
            data: documents,
        };
    }
    async getFolders(org_id, user_id) {
        const qb = this.documentsRepository
            .createQueryBuilder('document')
            .select('document.folder', 'folder')
            .addSelect('COUNT(*)', 'document_count')
            .where('document.org_id = :org_id', { org_id })
            .andWhere('document.folder IS NOT NULL')
            .andWhere('document.is_archived = :is_archived', { is_archived: false });
        if (user_id) {
            qb.andWhere('document.created_by = :user_id', { user_id });
        }
        const folders = await qb
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
    async getVersions(id, org_id) {
        const document = await this.documentsRepository.findOne({ where: { id, org_id } });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        const baseTitle = document.title.replace(/\s\(v\d+\)$/, '');
        const versions = await this.documentsRepository
            .createQueryBuilder('document')
            .where('document.org_id = :org_id', { org_id })
            .andWhere('(document.id = :id OR document.title LIKE :title)', {
            id,
            title: `${baseTitle} (v%)`,
        })
            .orderBy('document.version', 'DESC')
            .getMany();
        return { success: true, data: versions };
    }
    async createFolder(org_id, user_id, folderData) {
        const folderName = folderData.parent_folder_id
            ? `${folderData.parent_folder_id}/${folderData.name}`
            : folderData.name;
        const marker = this.documentsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            title: `${folderData.name} (folder)`,
            content: '',
            type: 'folder',
            folder: folderName,
            created_by: user_id,
            version: 1,
        });
        await this.documentsRepository.save(marker);
        return { success: true, data: { name: folderName } };
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