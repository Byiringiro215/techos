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
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const workspace_record_entity_1 = require("../../entities/workspace-record.entity");
const activity_event_entity_1 = require("../../entities/activity-event.entity");
const record_comment_entity_1 = require("../../entities/record-comment.entity");
const activity_log_service_1 = require("../../common/services/activity-log.service");
const org_admin_1 = require("../../common/utils/org-admin");
let WorkspaceService = class WorkspaceService {
    recordsRepository;
    activityRepository;
    commentsRepository;
    activityLogService;
    constructor(recordsRepository, activityRepository, commentsRepository, activityLogService) {
        this.recordsRepository = recordsRepository;
        this.activityRepository = activityRepository;
        this.commentsRepository = commentsRepository;
        this.activityLogService = activityLogService;
    }
    isTeamMember(row, userId) {
        if (!userId)
            return false;
        const meta = (row.metadata || {});
        const leadId = meta.leadId || meta.lead_id;
        const memberIds = Array.isArray(meta.memberIds)
            ? meta.memberIds
            : Array.isArray(meta.member_ids)
                ? meta.member_ids
                : [];
        return leadId === userId || memberIds.includes(userId) || row.created_by === userId;
    }
    async list(org_id, type, user) {
        let data = await this.recordsRepository.find({
            where: { org_id, type },
            order: { updated_at: 'DESC' },
        });
        if (type === 'teams' && !(0, org_admin_1.isDeliveryAdmin)(user?.role)) {
            data = data.filter((row) => this.isTeamMember(row, user?.id));
        }
        return { success: true, data: data.map((row) => this.toUi(row)) };
    }
    async get(org_id, type, id, user) {
        const row = await this.recordsRepository.findOne({ where: { id, org_id, type } });
        if (!row)
            throw new common_1.NotFoundException('Record not found');
        if (type === 'teams' && !(0, org_admin_1.isDeliveryAdmin)(user?.role) && !this.isTeamMember(row, user?.id)) {
            throw new common_1.ForbiddenException('You are not a member of this team');
        }
        return { success: true, data: this.toUi(row) };
    }
    async create(org_id, type, actor, dto) {
        if (type === 'teams') {
            (0, org_admin_1.assertDeliveryAdmin)(actor, 'create teams');
        }
        const row = this.recordsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            type,
            title: dto.title,
            description: dto.description,
            status: dto.status || 'active',
            priority: dto.priority,
            owner: dto.owner,
            amount: dto.amount,
            due_date: dto.due_date,
            metadata: dto.metadata || {},
            created_by: actor?.id,
        });
        await this.recordsRepository.save(row);
        await this.recordActivity(org_id, type, row.id, 'created', this.activitySummary('created', type, row.title), actor);
        return { success: true, data: this.toUi(row) };
    }
    async update(org_id, type, id, actor, dto) {
        const row = await this.recordsRepository.findOne({ where: { id, org_id, type } });
        if (!row)
            throw new common_1.NotFoundException('Record not found');
        Object.assign(row, {
            title: dto.title ?? row.title,
            description: dto.description ?? row.description,
            status: dto.status ?? row.status,
            priority: dto.priority ?? row.priority,
            owner: dto.owner ?? row.owner,
            amount: dto.amount ?? row.amount,
            due_date: dto.due_date ?? row.due_date,
            metadata: dto.metadata ?? row.metadata,
        });
        await this.recordsRepository.save(row);
        await this.recordActivity(org_id, type, row.id, 'updated', this.activitySummary('updated', type, row.title), actor);
        return { success: true, data: this.toUi(row) };
    }
    async remove(org_id, type, id, actor) {
        const row = await this.recordsRepository.findOne({ where: { id, org_id, type } });
        if (!row)
            throw new common_1.NotFoundException('Record not found');
        await this.recordsRepository.remove(row);
        await this.recordActivity(org_id, type, id, 'deleted', this.activitySummary('deleted', type, row.title), actor);
        return { success: true, message: 'Deleted' };
    }
    async listComments(org_id, entity_type, entity_id) {
        const data = await this.commentsRepository.find({
            where: { org_id, entity_type, entity_id },
            order: { created_at: 'ASC' },
        });
        return {
            success: true,
            data: data.map((c) => ({
                id: c.id,
                entity_type: c.entity_type,
                entity_id: c.entity_id,
                body: c.body,
                author_id: c.author_id,
                author_name: c.author_name,
                created_at: c.created_at,
                updated_at: c.updated_at,
            })),
        };
    }
    async createComment(org_id, actor, dto) {
        const first = actor?.first_name || actor?.firstName || '';
        const last = actor?.last_name || actor?.lastName || '';
        const author_name = `${first} ${last}`.trim() || actor?.email || 'User';
        const author_id = String(actor?.id || actor?.sub || '');
        const row = this.commentsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            entity_type: dto.entity_type,
            entity_id: dto.entity_id,
            body: dto.body.trim(),
            author_id,
            author_name,
        });
        await this.commentsRepository.save(row);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'commented',
            resource_type: dto.entity_type,
            resource_id: dto.entity_id,
            summary: `commented: ${dto.body.trim().slice(0, 120)}`,
            metadata: { comment_id: row.id },
        });
        return {
            success: true,
            data: {
                id: row.id,
                entity_type: row.entity_type,
                entity_id: row.entity_id,
                body: row.body,
                author_id: row.author_id,
                author_name: row.author_name,
                created_at: row.created_at,
                updated_at: row.updated_at,
            },
        };
    }
    async removeComment(org_id, id, actor) {
        const row = await this.commentsRepository.findOne({ where: { id, org_id } });
        if (!row)
            throw new common_1.NotFoundException('Comment not found');
        const actorId = String(actor?.id || actor?.sub || '');
        const isOwner = row.author_id === actorId;
        const isCeo = String(actor?.role || '').toLowerCase() === 'ceo';
        if (!isOwner && !isCeo) {
            throw new common_1.NotFoundException('Comment not found');
        }
        await this.commentsRepository.remove(row);
        return { success: true, message: 'Comment deleted' };
    }
    async listActivity(org_id, entity_type, entity_id, actor_id) {
        if (actor_id && !entity_id && !entity_type) {
            const data = await this.activityLogService.listForActor(org_id, actor_id);
            return { success: true, data };
        }
        const qb = this.activityRepository
            .createQueryBuilder('a')
            .where('a.org_id = :org_id', { org_id })
            .orderBy('a.created_at', 'DESC')
            .take(100);
        if (actor_id && entity_id) {
            qb.andWhere('(a.actor_id = :actor_id OR (a.entity_type = :entity_type AND a.entity_id = :entity_id))', {
                actor_id,
                entity_type: entity_type || 'employees',
                entity_id,
            });
        }
        else if (actor_id) {
            qb.andWhere('a.actor_id = :actor_id', { actor_id });
        }
        else {
            if (entity_type)
                qb.andWhere('a.entity_type = :entity_type', { entity_type });
            if (entity_id)
                qb.andWhere('a.entity_id = :entity_id', { entity_id });
        }
        const data = await qb.getMany();
        return { success: true, data };
    }
    async recordActivity(org_id, entity_type, entity_id, action, summary, actor) {
        await this.activityLogService.log({
            org_id,
            actor,
            action,
            resource_type: entity_type,
            resource_id: entity_id,
            summary,
        });
    }
    activitySummary(action, type, title) {
        const label = this.humanizeEntityType(type);
        const name = (title || 'Untitled').trim();
        const verb = action === 'created' ? 'created' : action === 'updated' ? 'updated' : 'deleted';
        return `${verb} ${label} "${name}"`;
    }
    humanizeEntityType(type) {
        const spaced = type
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/_/g, ' ')
            .toLowerCase()
            .trim();
        if (spaced.endsWith('ies'))
            return `${spaced.slice(0, -3)}y`;
        if (spaced.endsWith('s') && !spaced.endsWith('ss'))
            return spaced.slice(0, -1);
        return spaced || 'record';
    }
    toUi(row) {
        return {
            id: row.id,
            org_id: row.org_id,
            type: row.type,
            title: row.title,
            name: row.title,
            description: row.description,
            status: row.status,
            statusVariant: this.statusVariant(row.status),
            priority: row.priority,
            owner: row.owner,
            amount: row.amount,
            dueDate: row.due_date,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            metadata: row.metadata,
        };
    }
    statusVariant(status) {
        const s = (status || '').toLowerCase();
        if (['active', 'completed', 'paid', 'approved', 'won'].includes(s))
            return 'success';
        if (['pending', 'in_progress', 'scheduled', 'draft', 'paused'].includes(s))
            return 'warning';
        if (['rejected', 'cancelled', 'terminated', 'lost'].includes(s))
            return 'error';
        return 'default';
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workspace_record_entity_1.WorkspaceRecord)),
    __param(1, (0, typeorm_1.InjectRepository)(activity_event_entity_1.ActivityEvent)),
    __param(2, (0, typeorm_1.InjectRepository)(record_comment_entity_1.RecordComment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        activity_log_service_1.ActivityLogService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map