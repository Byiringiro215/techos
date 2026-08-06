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
exports.SprintsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const sprints_service_1 = require("./sprints.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let SprintsController = class SprintsController {
    sprintsService;
    constructor(sprintsService) {
        this.sprintsService = sprintsService;
    }
    create(user, createSprintDto) {
        return this.sprintsService.create(user.org_id, createSprintDto);
    }
    findAll(user, project_id) {
        return this.sprintsService.findAll(user.org_id, project_id);
    }
    findOne(user, id) {
        return this.sprintsService.findOne(id, user.org_id);
    }
    getStats(user, id) {
        return this.sprintsService.getStats(id, user.org_id);
    }
    getActive(user, projectId) {
        return this.sprintsService.findActiveSprint(projectId, user.org_id);
    }
    update(user, id, updateSprintDto) {
        return this.sprintsService.update(id, user.org_id, updateSprintDto);
    }
    start(user, id) {
        return this.sprintsService.startSprint(id, user.org_id);
    }
    complete(user, id) {
        return this.sprintsService.completeSprint(id, user.org_id);
    }
    addTask(user, sprintId, taskId) {
        return this.sprintsService.addTaskToSprint(sprintId, taskId, user.org_id);
    }
    removeTask(user, sprintId, taskId) {
        return this.sprintsService.removeTaskFromSprint(sprintId, taskId, user.org_id);
    }
    remove(user, id) {
        return this.sprintsService.remove(id, user.org_id);
    }
};
exports.SprintsController = SprintsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('project_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('active/:projectId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "getActive", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "start", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':sprintId/tasks/:taskId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('sprintId')),
    __param(2, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "addTask", null);
__decorate([
    (0, common_1.Delete)(':sprintId/tasks/:taskId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('sprintId')),
    __param(2, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "removeTask", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "remove", null);
exports.SprintsController = SprintsController = __decorate([
    (0, common_1.Controller)('sprints'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sprints_service_1.SprintsService])
], SprintsController);
//# sourceMappingURL=sprints.controller.js.map