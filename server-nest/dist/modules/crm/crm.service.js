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
exports.CrmService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const contact_entity_1 = require("../../entities/contact.entity");
const deal_entity_1 = require("../../entities/deal.entity");
const user_entity_1 = require("../../entities/user.entity");
const activity_log_service_1 = require("../../common/services/activity-log.service");
let CrmService = class CrmService {
    contactsRepository;
    dealsRepository;
    usersRepository;
    activityLogService;
    constructor(contactsRepository, dealsRepository, usersRepository, activityLogService) {
        this.contactsRepository = contactsRepository;
        this.dealsRepository = dealsRepository;
        this.usersRepository = usersRepository;
        this.activityLogService = activityLogService;
    }
    async createContact(org_id, createContactDto) {
        const contact = this.contactsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createContactDto,
            type: createContactDto.type || 'lead',
            status: createContactDto.status || 'active',
        });
        await this.contactsRepository.save(contact);
        return {
            success: true,
            data: contact,
        };
    }
    async findAllContacts(org_id, filters) {
        const where = { org_id };
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        const contacts = await this.contactsRepository.find({
            where,
            order: { created_at: 'DESC' },
        });
        const contactsWithDeals = await Promise.all(contacts.map(async (contact) => {
            const dealCount = await this.dealsRepository.count({
                where: { contact_id: contact.id },
            });
            const totalValue = await this.dealsRepository
                .createQueryBuilder('deal')
                .select('SUM(deal.value)', 'total')
                .where('deal.contact_id = :contactId', { contactId: contact.id })
                .andWhere('deal.stage = :stage', { stage: 'closed_won' })
                .getRawOne();
            return {
                ...contact,
                deal_count: dealCount,
                total_revenue: totalValue?.total || 0,
            };
        }));
        return {
            success: true,
            data: contactsWithDeals,
        };
    }
    async findOneContact(id, org_id) {
        const contact = await this.contactsRepository.findOne({
            where: { id, org_id },
        });
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        const deals = await this.dealsRepository
            .createQueryBuilder('deal')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'deal.assigned_to = user.id')
            .where('deal.contact_id = :contactId', { contactId: id })
            .select([
            'deal.*',
            'user.first_name as assigned_first_name',
            'user.last_name as assigned_last_name',
        ])
            .getRawMany();
        return {
            success: true,
            data: {
                ...contact,
                deals,
            },
        };
    }
    async updateContact(id, org_id, updateData) {
        const contact = await this.contactsRepository.findOne({
            where: { id, org_id },
        });
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        Object.assign(contact, updateData);
        await this.contactsRepository.save(contact);
        return {
            success: true,
            data: contact,
        };
    }
    async deleteContact(id, org_id) {
        const contact = await this.contactsRepository.findOne({
            where: { id, org_id },
        });
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        await this.contactsRepository.remove(contact);
        return {
            success: true,
            message: 'Contact deleted successfully',
        };
    }
    async createDeal(org_id, createDealDto, actor) {
        let contact_id = createDealDto.contact_id;
        if (contact_id) {
            const contact = await this.contactsRepository.findOne({
                where: { id: contact_id, org_id },
            });
            if (!contact) {
                throw new common_1.NotFoundException('Contact not found');
            }
        }
        else {
            const contact = this.contactsRepository.create({
                id: (0, crypto_1.randomUUID)(),
                org_id,
                first_name: 'Deal',
                last_name: 'Lead',
                company_name: createDealDto.title,
                type: 'lead',
                status: 'qualified',
                notes: createDealDto.notes || createDealDto.description,
            });
            await this.contactsRepository.save(contact);
            contact_id = contact.id;
        }
        const deal = this.dealsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            contact_id,
            title: createDealDto.title,
            value: Number(createDealDto.value || 0),
            stage: createDealDto.stage || 'qualification',
            currency: createDealDto.currency || 'USD',
            probability: createDealDto.probability || 0,
            expected_close_date: createDealDto.expected_close_date,
            assigned_to: createDealDto.assigned_to || actor?.id,
            notes: createDealDto.notes || createDealDto.description,
        });
        await this.dealsRepository.save(deal);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'created',
            resource_type: 'deals',
            resource_id: deal.id,
            summary: `created deal "${deal.title || 'Untitled'}"`,
        });
        return {
            success: true,
            data: deal,
        };
    }
    async findAllDeals(org_id, filters) {
        const where = { org_id };
        if (filters?.stage) {
            where.stage = filters.stage;
        }
        if (filters?.assigned_to) {
            where.assigned_to = filters.assigned_to;
        }
        const deals = await this.dealsRepository.find({
            where,
            order: { created_at: 'DESC' },
        });
        const ownerIds = [...new Set(deals.map((d) => d.assigned_to).filter(Boolean))];
        const owners = ownerIds.length
            ? await this.usersRepository.find({ where: { id: (0, typeorm_2.In)(ownerIds) } })
            : [];
        const ownerMap = new Map(owners.map((u) => [u.id, u]));
        const contactIds = [...new Set(deals.map((d) => d.contact_id).filter(Boolean))];
        const contacts = contactIds.length
            ? await this.contactsRepository.find({ where: { id: (0, typeorm_2.In)(contactIds) } })
            : [];
        const contactMap = new Map(contacts.map((c) => [c.id, c]));
        const data = deals.map((deal) => {
            const owner = ownerMap.get(deal.assigned_to);
            const contact = contactMap.get(deal.contact_id);
            const owner_name = owner
                ? `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || owner.email
                : '—';
            return {
                ...deal,
                owner_name,
                assigned_to: deal.assigned_to,
                company_name: contact?.company_name || null,
                updated_at: deal.created_at,
            };
        });
        return {
            success: true,
            data,
        };
    }
    async findOneDeal(id, org_id) {
        const deal = await this.dealsRepository
            .createQueryBuilder('deal')
            .leftJoinAndSelect(contact_entity_1.Contact, 'contact', 'deal.contact_id = contact.id')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'deal.assigned_to = user.id')
            .where('deal.id = :id', { id })
            .andWhere('deal.org_id = :org_id', { org_id })
            .select([
            'deal.*',
            'contact.*',
            'user.first_name as assigned_first_name',
            'user.last_name as assigned_last_name',
        ])
            .getRawOne();
        if (!deal) {
            throw new common_1.NotFoundException('Deal not found');
        }
        return {
            success: true,
            data: deal,
        };
    }
    async updateDeal(id, org_id, updateData, actor) {
        const deal = await this.dealsRepository.findOne({
            where: { id, org_id },
        });
        if (!deal) {
            throw new common_1.NotFoundException('Deal not found');
        }
        Object.assign(deal, updateData);
        await this.dealsRepository.save(deal);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'updated',
            resource_type: 'deals',
            resource_id: deal.id,
            summary: `updated deal "${deal.title || 'Untitled'}"`,
            changes: updateData,
        });
        return {
            success: true,
            data: deal,
        };
    }
    async deleteDeal(id, org_id, actor) {
        const deal = await this.dealsRepository.findOne({
            where: { id, org_id },
        });
        if (!deal) {
            throw new common_1.NotFoundException('Deal not found');
        }
        const title = deal.title;
        await this.dealsRepository.remove(deal);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'deleted',
            resource_type: 'deals',
            resource_id: id,
            summary: `deleted deal "${title || 'Untitled'}"`,
        });
        return {
            success: true,
            message: 'Deal deleted successfully',
        };
    }
    async getPipelineStats(org_id) {
        const stages = ['qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
        const stats = await Promise.all(stages.map(async (stage) => {
            const result = await this.dealsRepository
                .createQueryBuilder('deal')
                .select('COUNT(*)', 'count')
                .addSelect('SUM(deal.value)', 'total_value')
                .where('deal.org_id = :org_id', { org_id })
                .andWhere('deal.stage = :stage', { stage })
                .getRawOne();
            return {
                stage,
                count: parseInt(result.count) || 0,
                total_value: parseFloat(result.total_value) || 0,
            };
        }));
        const wonCount = stats.find(s => s.stage === 'closed_won')?.count || 0;
        const lostCount = stats.find(s => s.stage === 'closed_lost')?.count || 0;
        const totalClosed = wonCount + lostCount;
        const winRate = totalClosed > 0 ? (wonCount / totalClosed) * 100 : 0;
        return {
            success: true,
            data: {
                pipeline: stats,
                win_rate: winRate.toFixed(2),
                total_deals: stats.reduce((sum, s) => sum + s.count, 0),
                total_pipeline_value: stats
                    .filter(s => !['closed_won', 'closed_lost'].includes(s.stage))
                    .reduce((sum, s) => sum + s.total_value, 0),
                total_revenue: stats.find(s => s.stage === 'closed_won')?.total_value || 0,
            },
        };
    }
    async scoreContact(contact_id, org_id) {
        const contact = await this.contactsRepository.findOne({
            where: { id: contact_id, org_id },
        });
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        let score = 0;
        if (contact.email)
            score += 20;
        if (contact.phone)
            score += 10;
        if (contact.company_name)
            score += 15;
        const dealCount = await this.dealsRepository.count({
            where: { contact_id },
        });
        score += dealCount * 25;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (new Date(contact.created_at) > thirtyDaysAgo) {
            score += 20;
        }
        score = Math.min(score, 100);
        return {
            success: true,
            data: {
                contact_id,
                score,
                rating: score >= 80 ? 'hot' : score >= 50 ? 'warm' : 'cold',
            },
        };
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __param(1, (0, typeorm_1.InjectRepository)(deal_entity_1.Deal)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        activity_log_service_1.ActivityLogService])
], CrmService);
//# sourceMappingURL=crm.service.js.map