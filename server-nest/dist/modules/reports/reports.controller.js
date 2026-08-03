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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const reports_service_1 = require("./reports.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    create(user, createDto) {
        return this.reportsService.createReport(user.org_id, user.id, createDto);
    }
    findAll(user, filters) {
        return this.reportsService.findAll(user.org_id, filters);
    }
    findOne(user, id) {
        return this.reportsService.findOne(id, user.org_id);
    }
    update(user, id, updateDto) {
        return this.reportsService.updateReport(id, user.org_id, updateDto);
    }
    remove(user, id) {
        return this.reportsService.removeReport(id, user.org_id);
    }
    generateProjectReport(user, project_id) {
        return this.reportsService.generateProjectReport(user.org_id, project_id);
    }
    generateFinancialReport(user, start_date, end_date) {
        return this.reportsService.generateFinancialReport(user.org_id, start_date, end_date);
    }
    generateKPIReport(user) {
        return this.reportsService.generateKPIReport(user.org_id);
    }
    generateTaskReport(user, user_id, start_date, end_date) {
        return this.reportsService.generateTaskReport(user.org_id, user_id, start_date, end_date);
    }
    generateBugReport(user, start_date, end_date) {
        return this.reportsService.generateBugReport(user.org_id, start_date, end_date);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('saved/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('saved/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('saved/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('generate/project'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('project_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateProjectReport", null);
__decorate([
    (0, common_1.Get)('generate/financial'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('start_date')),
    __param(2, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateFinancialReport", null);
__decorate([
    (0, common_1.Get)('generate/kpi'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateKPIReport", null);
__decorate([
    (0, common_1.Get)('generate/tasks'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Query)('start_date')),
    __param(3, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateTaskReport", null);
__decorate([
    (0, common_1.Get)('generate/bugs'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('start_date')),
    __param(2, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateBugReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map