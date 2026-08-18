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
exports.CisoController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const ciso_service_1 = require("./ciso.service");
const create_ciso_report_dto_1 = require("./dto/create-ciso-report.dto");
const create_project_audit_dto_1 = require("./dto/create-project-audit.dto");
const update_project_audit_dto_1 = require("./dto/update-project-audit.dto");
const get_ciso_audit_projects_query_dto_1 = require("./dto/get-ciso-audit-projects-query.dto");
const create_audit_task_dto_1 = require("./dto/create-audit-task.dto");
const update_audit_task_dto_1 = require("./dto/update-audit-task.dto");
const get_audit_tasks_query_dto_1 = require("./dto/get-audit-tasks-query.dto");
const update_ciso_task_status_dto_1 = require("./dto/update-ciso-task-status.dto");
let CisoController = class CisoController {
    cisoService;
    constructor(cisoService) {
        this.cisoService = cisoService;
    }
    ensureCisoAccess(user) {
        if (!['ciso', 'ceo'].includes(user.role)) {
            throw new common_1.ForbiddenException('CISO access required');
        }
    }
    createAudit(user, body) {
        this.ensureCisoAccess(user);
        return this.cisoService.createAudit(user.org_id, user.id, body);
    }
    getAudits(user, query) {
        this.ensureCisoAccess(user);
        return this.cisoService.getAudits(user.org_id, query.status);
    }
    getAudit(user, id) {
        this.ensureCisoAccess(user);
        return this.cisoService.getAudit(user.org_id, id);
    }
    updateAudit(user, id, body) {
        this.ensureCisoAccess(user);
        return this.cisoService.updateAudit(user.org_id, id, body);
    }
    deleteAudit(user, id) {
        this.ensureCisoAccess(user);
        return this.cisoService.deleteAudit(user.org_id, id);
    }
    createAuditTask(user, body) {
        this.ensureCisoAccess(user);
        return this.cisoService.createAuditTask(user.org_id, user.id, body);
    }
    getAuditTasks(user, query) {
        this.ensureCisoAccess(user);
        return this.cisoService.getAuditTasks(user.org_id, query);
    }
    updateAuditTask(user, id, body) {
        this.ensureCisoAccess(user);
        return this.cisoService.updateAuditTask(user.org_id, id, body);
    }
    updateAuditTaskStatus(user, id, body) {
        this.ensureCisoAccess(user);
        return this.cisoService.updateAuditTaskStatus(user.org_id, id, Boolean(body.finished));
    }
    deleteAuditTask(user, id) {
        this.ensureCisoAccess(user);
        return this.cisoService.deleteAuditTask(user.org_id, id);
    }
    getTasks(user, query) {
        this.ensureCisoAccess(user);
        return this.cisoService.getAuditTasks(user.org_id, query);
    }
    updateTaskStatus(user, id, body) {
        this.ensureCisoAccess(user);
        return this.cisoService.updateAuditTaskStatus(user.org_id, id, Boolean(body.finished));
    }
    getAuditProjects(user, query) {
        this.ensureCisoAccess(user);
        return this.cisoService.getAudits(user.org_id, query.status);
    }
    getReports(user) {
        this.ensureCisoAccess(user);
        return this.cisoService.getReports(user.org_id);
    }
    createReport(user, body) {
        this.ensureCisoAccess(user);
        return this.cisoService.createReport(user.org_id, user.id, body);
    }
};
exports.CisoController = CisoController;
__decorate([
    (0, common_1.Post)('audits'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_project_audit_dto_1.CreateProjectAuditDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "createAudit", null);
__decorate([
    (0, common_1.Get)('audits'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_ciso_audit_projects_query_dto_1.GetCisoAuditProjectsQueryDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "getAudits", null);
__decorate([
    (0, common_1.Get)('audits/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "getAudit", null);
__decorate([
    (0, common_1.Put)('audits/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_project_audit_dto_1.UpdateProjectAuditDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "updateAudit", null);
__decorate([
    (0, common_1.Delete)('audits/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "deleteAudit", null);
__decorate([
    (0, common_1.Post)('audit-tasks'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_audit_task_dto_1.CreateAuditTaskDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "createAuditTask", null);
__decorate([
    (0, common_1.Get)('audit-tasks'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_audit_tasks_query_dto_1.GetAuditTasksQueryDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "getAuditTasks", null);
__decorate([
    (0, common_1.Put)('audit-tasks/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_audit_task_dto_1.UpdateAuditTaskDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "updateAuditTask", null);
__decorate([
    (0, common_1.Patch)('audit-tasks/:id/status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_ciso_task_status_dto_1.UpdateCisoTaskStatusDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "updateAuditTaskStatus", null);
__decorate([
    (0, common_1.Delete)('audit-tasks/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "deleteAuditTask", null);
__decorate([
    (0, common_1.Get)('tasks'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_audit_tasks_query_dto_1.GetAuditTasksQueryDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Patch)('tasks/:id/status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_ciso_task_status_dto_1.UpdateCisoTaskStatusDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "updateTaskStatus", null);
__decorate([
    (0, common_1.Get)('projects/audits'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_ciso_audit_projects_query_dto_1.GetCisoAuditProjectsQueryDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "getAuditProjects", null);
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "getReports", null);
__decorate([
    (0, common_1.Post)('reports'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_ciso_report_dto_1.CreateCisoReportDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "createReport", null);
exports.CisoController = CisoController = __decorate([
    (0, common_1.Controller)('ciso'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ciso_service_1.CisoService])
], CisoController);
//# sourceMappingURL=ciso.controller.js.map