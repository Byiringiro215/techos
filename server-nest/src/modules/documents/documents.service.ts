import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Document } from '../../entities/document.entity';
import { User } from '../../entities/user.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CloudinaryService } from '../../common/services/cloudinary.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(org_id: string, user_id: string, createDocumentDto: CreateDocumentDto) {
    const document = this.documentsRepository.create({
      id: randomUUID(),
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

  async uploadFile(org_id: string, user_id: string, file: Express.Multer.File, metadata?: any) {
    // Upload to Cloudinary
    const uploadResult = await this.cloudinaryService.uploadFile(file, `techos/${org_id}/documents`);

    // Create document record
    const document = this.documentsRepository.create({
      id: randomUUID(),
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

  async findAll(org_id: string, filters?: any) {
    const where: any = { org_id, is_archived: false };

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

    return {
      success: true,
      data: documents,
    };
  }

  async findOne(id: string, org_id: string) {
    const document = await this.documentsRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect(User, 'user', 'document.created_by = user.id')
      .where('document.id = :id', { id })
      .andWhere('document.org_id = :org_id', { org_id })
      .select([
        'document.*',
        'user.first_name as created_by_first_name',
        'user.last_name as created_by_last_name',
      ])
      .getRawOne();

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return {
      success: true,
      data: document,
    };
  }

  async update(id: string, org_id: string, updateData: Partial<Document>) {
    const document = await this.documentsRepository.findOne({
      where: { id, org_id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    Object.assign(document, updateData);
    await this.documentsRepository.save(document);

    return {
      success: true,
      data: document,
    };
  }

  async remove(id: string, org_id: string) {
    const document = await this.documentsRepository.findOne({
      where: { id, org_id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.documentsRepository.remove(document);

    return {
      success: true,
      message: 'Document deleted successfully',
    };
  }

  async archive(id: string, org_id: string) {
    const document = await this.documentsRepository.findOne({
      where: { id, org_id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    document.is_archived = true;
    await this.documentsRepository.save(document);

    return {
      success: true,
      message: 'Document archived successfully',
    };
  }

  async search(org_id: string, query: string) {
    const documents = await this.documentsRepository
      .createQueryBuilder('document')
      .where('document.org_id = :org_id', { org_id })
      .andWhere('document.is_archived = :is_archived', { is_archived: false })
      .andWhere(
        '(document.title LIKE :query OR document.content LIKE :query OR document.tags LIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('document.updated_at', 'DESC')
      .limit(50)
      .getMany();

    return {
      success: true,
      data: documents,
    };
  }

  async getFolders(org_id: string) {
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

  async createVersion(id: string, org_id: string, user_id: string, content: string) {
    const document = await this.documentsRepository.findOne({
      where: { id, org_id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Create new version
    const newVersion = this.documentsRepository.create({
      id: randomUUID(),
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

    // Update original document version number
    document.version += 1;
    await this.documentsRepository.save(document);

    return {
      success: true,
      data: newVersion,
    };
  }

  async getVersions(id: string, org_id: string) {
    const document = await this.documentsRepository.findOne({ where: { id, org_id } });
    if (!document) {
      throw new NotFoundException('Document not found');
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

  async createFolder(org_id: string, user_id: string, folderData: { name: string; parent_folder_id?: string }) {
    const folderName = folderData.parent_folder_id
      ? `${folderData.parent_folder_id}/${folderData.name}`
      : folderData.name;

    const marker = this.documentsRepository.create({
      id: randomUUID(),
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
}
