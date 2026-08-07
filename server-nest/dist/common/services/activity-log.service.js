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
exports.ActivityLogService = exports.VALUABLE_ACTIVITY_TYPES = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const activity_event_entity_1 = require("../../entities/activity-event.entity");
const audit_log_entity_1 = require("../../entities/audit-log.entity");
exports.VALUABLE_ACTIVITY_TYPES = new Set([
    'tasks',
    'projects',
    'sprints',
    'deals',
    'contacts',
    'invoices',
    'expenses',
    'goals',
    'meetings',
    'leaves',
    'leave_requests',
    'documents',
    'messages',
    'bugs',
    'features',
    'codeReviews',
    'workspace',
]);
let ActivityLogService = class ActivityLogService {
    activityRepository;
    auditRepository;
    constructor(activityRepository, auditRepository) {
        this.activityRepository = activityRepository;
        this.auditRepository = auditRepository;
    }
    actorName(actor) {
        const first = actor?.first_name || actor?.firstName || '';
        const last = actor?.last_name || actor?.lastName || '';
        return `${first} ${last}`.trim() || actor?.email || actor?.name || 'System';
    }
    async log(input) {
        const actorId = input.actor?.id || input.actor?.sub || null;
        const actor_name = this.actorName(input.actor);
        const event = this.activityRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id: input.org_id,
            entity_type: input.resource_type,
            entity_id: input.resource_id,
            action: input.action,
            summary: input.summary,
            actor_id: actorId,
            actor_name,
            metadata: input.metadata || input.changes || undefined,
        });
        await this.activityRepository.save(event);
        if (actorId) {
            const audit = this.auditRepository.create({
                id: (0, crypto_1.randomUUID)(),
                org_id: input.org_id,
                user_id: String(actorId),
                action: input.action,
                resource_type: input.resource_type,
                resource_id: String(input.resource_id),
                changes: {
                    summary: input.summary,
                    ...(input.changes || {}),
                },
                ip_address: input.ip_address,
                user_agent: input.user_agent,
            });
            await this.auditRepository.save(audit);
        }
        return event;
    }
    async listForActor(org_id, actor_id, take = 40) {
        const rows = await this.activityRepository
            .createQueryBuilder('a')
            .where('a.org_id = :org_id', { org_id })
            .andWhere('CAST(a.actor_id AS text) = :actor_id', { actor_id: String(actor_id) })
            .orderBy('a.created_at', 'DESC')
            .take(Math.max(take * 3, 60))
            .getMany();
        const valuable = rows.filter((row) => {
            const type = (row.entity_type || '').toLowerCase();
            if (exports.VALUABLE_ACTIVITY_TYPES.has(type))
                return true;
            if (type && !['employees', 'users', 'organizations'].includes(type))
                return true;
            return false;
        });
        return valuable.slice(0, take);
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_event_entity_1.ActivityEvent)),
    __param(1, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map