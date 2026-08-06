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
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const announcement_entity_1 = require("../../entities/announcement.entity");
const events_gateway_1 = require("../../common/gateways/events.gateway");
let AnnouncementsService = class AnnouncementsService {
    announcementRepository;
    eventsGateway;
    constructor(announcementRepository, eventsGateway) {
        this.announcementRepository = announcementRepository;
        this.eventsGateway = eventsGateway;
    }
    async create(org_id, author_id, createDto) {
        const announcement = this.announcementRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            author_id,
            ...createDto,
            is_pinned: false,
        });
        await this.announcementRepository.save(announcement);
        this.eventsGateway.sendToOrganization(org_id, 'announcement:new', announcement);
        return { success: true, data: announcement };
    }
    async findAll(org_id, filters) {
        const query = this.announcementRepository.createQueryBuilder('announcement')
            .where('announcement.org_id = :org_id', { org_id });
        if (filters?.priority) {
            query.andWhere('announcement.priority = :priority', { priority: filters.priority });
        }
        if (filters?.is_pinned !== undefined) {
            query.andWhere('announcement.is_pinned = :is_pinned', { is_pinned: filters.is_pinned });
        }
        query.orderBy('announcement.is_pinned', 'DESC')
            .addOrderBy('announcement.created_at', 'DESC');
        const announcements = await query.getMany();
        return { success: true, data: announcements };
    }
    async findOne(id, org_id) {
        const announcement = await this.announcementRepository.findOne({
            where: { id, org_id },
        });
        if (!announcement) {
            throw new common_1.NotFoundException('Announcement not found');
        }
        return { success: true, data: announcement };
    }
    async update(id, org_id, updateDto) {
        const announcement = await this.announcementRepository.findOne({
            where: { id, org_id },
        });
        if (!announcement) {
            throw new common_1.NotFoundException('Announcement not found');
        }
        Object.assign(announcement, updateDto);
        await this.announcementRepository.save(announcement);
        this.eventsGateway.sendToOrganization(org_id, 'announcement:updated', announcement);
        return { success: true, data: announcement };
    }
    async togglePin(id, org_id) {
        const announcement = await this.announcementRepository.findOne({
            where: { id, org_id },
        });
        if (!announcement) {
            throw new common_1.NotFoundException('Announcement not found');
        }
        announcement.is_pinned = !announcement.is_pinned;
        await this.announcementRepository.save(announcement);
        this.eventsGateway.sendToOrganization(org_id, 'announcement:updated', announcement);
        return { success: true, data: announcement };
    }
    async setPinStatus(id, org_id, isPinned) {
        const announcement = await this.announcementRepository.findOne({
            where: { id, org_id },
        });
        if (!announcement) {
            throw new common_1.NotFoundException('Announcement not found');
        }
        announcement.is_pinned = isPinned;
        await this.announcementRepository.save(announcement);
        this.eventsGateway.sendToOrganization(org_id, 'announcement:updated', announcement);
        return { success: true, data: announcement };
    }
    async remove(id, org_id) {
        const announcement = await this.announcementRepository.findOne({
            where: { id, org_id },
        });
        if (!announcement) {
            throw new common_1.NotFoundException('Announcement not found');
        }
        await this.announcementRepository.remove(announcement);
        this.eventsGateway.sendToOrganization(org_id, 'announcement:deleted', { id });
        return { success: true, message: 'Announcement deleted successfully' };
    }
    async getPinned(org_id) {
        const pinned = await this.announcementRepository.find({
            where: { org_id, is_pinned: true },
            order: { created_at: 'DESC' },
        });
        return { success: true, data: pinned };
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(announcement_entity_1.Announcement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        events_gateway_1.EventsGateway])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map