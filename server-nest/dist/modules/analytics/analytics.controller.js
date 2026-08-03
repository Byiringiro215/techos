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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const analytics_service_1 = require("./analytics.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getOverview(user) {
        return this.analyticsService.getOverview(user.org_id);
    }
    getProjectAnalytics(user, project_id) {
        return this.analyticsService.getProjectAnalytics(user.org_id, project_id);
    }
    getTeamProductivity(user, start_date, end_date) {
        return this.analyticsService.getTeamProductivity(user.org_id, start_date, end_date);
    }
    getSprintAnalytics(user, sprint_id) {
        return this.analyticsService.getSprintAnalytics(user.org_id, sprint_id);
    }
    getBugAnalytics(user) {
        return this.analyticsService.getBugAnalytics(user.org_id);
    }
    getTimeTracking(user, user_id, project_id) {
        return this.analyticsService.getTimeTracking(user.org_id, user_id, project_id);
    }
    createKPI(user, createDto) {
        return this.analyticsService.createKPI(user.org_id, user.id, createDto);
    }
    getAllKPIs(user, filters) {
        return this.analyticsService.getAllKPIs(user.org_id, filters);
    }
    updateKPI(user, id, updateDto) {
        return this.analyticsService.updateKPI(id, user.org_id, updateDto);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('projects'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('project_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getProjectAnalytics", null);
__decorate([
    (0, common_1.Get)('team-productivity'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('start_date')),
    __param(2, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getTeamProductivity", null);
__decorate([
    (0, common_1.Get)('sprints'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('sprint_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getSprintAnalytics", null);
__decorate([
    (0, common_1.Get)('bugs'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getBugAnalytics", null);
__decorate([
    (0, common_1.Get)('time-tracking'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Query)('project_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getTimeTracking", null);
__decorate([
    (0, common_1.Post)('kpis'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "createKPI", null);
__decorate([
    (0, common_1.Get)('kpis'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getAllKPIs", null);
__decorate([
    (0, common_1.Put)('kpis/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "updateKPI", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map