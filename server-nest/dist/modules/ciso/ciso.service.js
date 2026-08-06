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
const task_entity_1 = require("../../entities/task.entity");
const project_entity_1 = require("../../entities/project.entity");
const report_entity_1 = require("../../entities/report.entity");
let CisoService = class CisoService {
    tasksRepository;
    projectsRepository;
    reportsRepository;
    constructor(tasksRepository, projectsRepository, reportsRepository) {
        this.tasksRepository = tasksRepository;
        this.projectsRepository = projectsRepository;
        this.reportsRepository = reportsRepository;
    }
    async getTasks(org_id, status) {
        const tasks = await this.tasksRepository.find({
            where: { org_id },
            order: { created_at: 'DESC' },
        });
        const filtered = tasks.filter((task) => {
            if (status === 'finished')
                return task.status === 'done';
            if (status === 'not_finished')
                return task.status !== 'done';
            return true;
        });
        return {
            success: true,
            data: filtered.map((task) => ({
                ...task,
                finished: task.status === 'done',
            })),
        };
    }
    async updateTaskStatus(org_id, task_id, finished) {
        const task = await this.tasksRepository.findOne({ where: { id: task_id, org_id } });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        task.status = finished ? 'done' : task.status === 'done' ? 'todo' : task.status;
        await this.tasksRepository.save(task);
        return { success: true, data: { ...task, finished: task.status === 'done' } };
    }
    async getAuditProjects(org_id, status) {
        const projects = await this.projectsRepository.find({
            where: { org_id },
            order: { created_at: 'DESC' },
        });
        const normalized = projects.map((project) => {
            const metadata = project.metadata || {};
            const priorityNeedsAudit = project.priority === 'high' || project.priority === 'critical';
            const auditRequired = Boolean(metadata.audit_required ?? priorityNeedsAudit);
            const auditStatus = metadata.audit_status || (auditRequired ? 'needed' : 'completed');
            return {
                ...project,
                audit_required: auditRequired,
                audit_status: auditStatus,
            };
        });
        const filtered = normalized.filter((project) => {
            if (!project.audit_required && status !== 'completed')
                return false;
            if (status)
                return project.audit_status === status;
            return project.audit_required || project.audit_status === 'in_progress';
        });
        return { success: true, data: filtered };
    }
    async updateAuditStatus(org_id, project_id, audit_status) {
        const project = await this.projectsRepository.findOne({ where: { id: project_id, org_id } });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const metadata = project.metadata || {};
        project.metadata = {
            ...metadata,
            audit_required: true,
            audit_status,
            audit_updated_at: new Date().toISOString(),
        };
        await this.projectsRepository.save(project);
        return { success: true, data: project };
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
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CisoService);
//# sourceMappingURL=ciso.service.js.map