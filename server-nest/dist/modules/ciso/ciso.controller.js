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
const get_ciso_tasks_query_dto_1 = require("./dto/get-ciso-tasks-query.dto");
const update_ciso_task_status_dto_1 = require("./dto/update-ciso-task-status.dto");
const get_ciso_audit_projects_query_dto_1 = require("./dto/get-ciso-audit-projects-query.dto");
const update_ciso_audit_status_dto_1 = require("./dto/update-ciso-audit-status.dto");
const create_ciso_report_dto_1 = require("./dto/create-ciso-report.dto");
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
    getTasks(user, query) {
        this.ensureCisoAccess(user);
        return this.cisoService.getTasks(user.org_id, query.status);
    }
    updateTaskStatus(user, id, body) {
        this.ensureCisoAccess(user);
        return this.cisoService.updateTaskStatus(user.org_id, id, Boolean(body.finished));
    }
    getAuditProjects(user, query) {
        this.ensureCisoAccess(user);
        return this.cisoService.getAuditProjects(user.org_id, query.status);
    }
    updateAuditStatus(user, id, body) {
        this.ensureCisoAccess(user);
        return this.cisoService.updateAuditStatus(user.org_id, id, body.audit_status);
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
    (0, common_1.Get)('tasks'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_ciso_tasks_query_dto_1.GetCisoTasksQueryDto]),
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
    (0, common_1.Patch)('projects/:id/audit-status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_ciso_audit_status_dto_1.UpdateCisoAuditStatusDto]),
    __metadata("design:returntype", void 0)
], CisoController.prototype, "updateAuditStatus", null);
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