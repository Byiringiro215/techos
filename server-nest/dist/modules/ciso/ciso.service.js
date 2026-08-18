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
exports.CisoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const project_audit_entity_1 = require("../../entities/project-audit.entity");
const audit_task_entity_1 = require("../../entities/audit-task.entity");
const report_entity_1 = require("../../entities/report.entity");
let CisoService = class CisoService {
    auditsRepository;
    auditTasksRepository;
    reportsRepository;
    constructor(auditsRepository, auditTasksRepository, reportsRepository) {
        this.auditsRepository = auditsRepository;
        this.auditTasksRepository = auditTasksRepository;
        this.reportsRepository = reportsRepository;
    }
    mapAudit(audit, taskCount = 0) {
        return {
            ...audit,
            task_count: taskCount,
        };
    }
    mapTask(task) {
        return {
            ...task,
            finished: task.status === 'done',
            audit_name: task.audit?.name || null,
        };
    }
    async createAudit(org_id, user_id, dto) {
        const audit = this.auditsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            name: dto.name.trim(),
            description: dto.description?.trim() || null,
            status: dto.status || 'needed',
            created_by: user_id,
        });
        await this.auditsRepository.save(audit);
        return { success: true, data: this.mapAudit(audit, 0) };
    }
    async getAudits(org_id, status) {
        const where = { org_id };
        if (status)
            where.status = status;
        const audits = await this.auditsRepository.find({
            where,
            order: { updated_at: 'DESC' },
            relations: ['tasks'],
        });
        return {
            success: true,
            data: audits.map((audit) => this.mapAudit(audit, audit.tasks?.length || 0)),
        };
    }
    async getAudit(org_id, id) {
        const audit = await this.auditsRepository.findOne({
            where: { id, org_id },
            relations: ['tasks'],
        });
        if (!audit)
            throw new common_1.NotFoundException('Project audit not found');
        return { success: true, data: this.mapAudit(audit, audit.tasks?.length || 0) };
    }
    async updateAudit(org_id, id, dto) {
        const audit = await this.auditsRepository.findOne({
            where: { id, org_id },
            relations: ['tasks'],
        });
        if (!audit)
            throw new common_1.NotFoundException('Project audit not found');
        if (dto.name !== undefined)
            audit.name = dto.name.trim();
        if (dto.description !== undefined)
            audit.description = dto.description.trim() || null;
        if (dto.status !== undefined)
            audit.status = dto.status;
        await this.auditsRepository.save(audit);
        return { success: true, data: this.mapAudit(audit, audit.tasks?.length || 0) };
    }
    async deleteAudit(org_id, id) {
        const audit = await this.auditsRepository.findOne({ where: { id, org_id } });
        if (!audit)
            throw new common_1.NotFoundException('Project audit not found');
        await this.auditsRepository.remove(audit);
        return { success: true, message: 'Project audit deleted' };
    }
    async createAuditTask(org_id, user_id, dto) {
        const audit = await this.auditsRepository.findOne({
            where: { id: dto.project_audit_id, org_id },
        });
        if (!audit)
            throw new common_1.BadRequestException('Select a valid project audit');
        const task = this.auditTasksRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            project_audit_id: dto.project_audit_id,
            title: dto.title.trim(),
            description: dto.description?.trim() || null,
            status: dto.status || 'todo',
            priority: dto.priority || 'medium',
            created_by: user_id,
        });
        await this.auditTasksRepository.save(task);
        task.audit = audit;
        return { success: true, data: this.mapTask(task) };
    }
    async getAuditTasks(org_id, filters) {
        const where = { org_id };
        if (filters?.project_audit_id)
            where.project_audit_id = filters.project_audit_id;
        const tasks = await this.auditTasksRepository.find({
            where,
            order: { created_at: 'DESC' },
            relations: ['audit'],
        });
        const filtered = tasks.filter((task) => {
            if (filters?.status === 'finished')
                return task.status === 'done';
            if (filters?.status === 'not_finished')
                return task.status !== 'done';
            return true;
        });
        return { success: true, data: filtered.map((task) => this.mapTask(task)) };
    }
    async updateAuditTask(org_id, id, dto) {
        const task = await this.auditTasksRepository.findOne({
            where: { id, org_id },
            relations: ['audit'],
        });
        if (!task)
            throw new common_1.NotFoundException('Audit task not found');
        if (dto.project_audit_id && dto.project_audit_id !== task.project_audit_id) {
            const audit = await this.auditsRepository.findOne({
                where: { id: dto.project_audit_id, org_id },
            });
            if (!audit)
                throw new common_1.BadRequestException('Select a valid project audit');
            task.project_audit_id = dto.project_audit_id;
            task.audit = audit;
        }
        if (dto.title !== undefined)
            task.title = dto.title.trim();
        if (dto.description !== undefined)
            task.description = dto.description.trim() || null;
        if (dto.status !== undefined)
            task.status = dto.status;
        if (dto.priority !== undefined)
            task.priority = dto.priority;
        await this.auditTasksRepository.save(task);
        return { success: true, data: this.mapTask(task) };
    }
    async updateAuditTaskStatus(org_id, id, finished) {
        return this.updateAuditTask(org_id, id, { status: finished ? 'done' : 'todo' });
    }
    async deleteAuditTask(org_id, id) {
        const task = await this.auditTasksRepository.findOne({ where: { id, org_id } });
        if (!task)
            throw new common_1.NotFoundException('Audit task not found');
        await this.auditTasksRepository.remove(task);
        return { success: true, message: 'Audit task deleted' };
    }
    async getReports(org_id) {
        const reports = await this.reportsRepository.find({
            where: { org_id },
            order: { created_at: 'DESC' },
        });
        const filtered = reports.filter((report) => ['security', 'audit', 'compliance', 'risk'].includes((report.type || '').toLowerCase()));
        return { success: true, data: filtered };
    }
    async createReport(org_id, user_id, payload) {
        const report = this.reportsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            created_by: user_id,
            title: payload.title,
            type: payload.type || 'security',
            config: { source: 'ciso_portal' },
            data: {
                summary: payload.summary || 'Security report drafted from CISO portal',
            },
            scheduled: null,
        });
        await this.reportsRepository.save(report);
        return { success: true, data: report };
    }
};
exports.CisoService = CisoService;
exports.CisoService = CisoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_audit_entity_1.ProjectAudit)),
    __param(1, (0, typeorm_1.InjectRepository)(audit_task_entity_1.AuditTask)),
    __param(2, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CisoService);
//# sourceMappingURL=ciso.service.js.map