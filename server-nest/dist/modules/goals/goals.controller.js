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
exports.GoalsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const goals_service_1 = require("./goals.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const create_goal_dto_1 = require("./dto/create-goal.dto");
const update_goal_dto_1 = require("./dto/update-goal.dto");
let GoalsController = class GoalsController {
    goalsService;
    constructor(goalsService) {
        this.goalsService = goalsService;
    }
    create(user, createDto) {
        return this.goalsService.create(user.org_id, createDto);
    }
    findAll(user, filters) {
        return this.goalsService.findAll(user.org_id, filters);
    }
    getAlignment(user) {
        return this.goalsService.getAlignment(user.org_id);
    }
    getProgressReport(user, quarter) {
        return this.goalsService.getProgressReport(user.org_id, quarter);
    }
    findOne(user, id) {
        return this.goalsService.findOne(id, user.org_id);
    }
    update(user, id, updateDto) {
        return this.goalsService.update(id, user.org_id, updateDto);
    }
    updateKeyResult(user, id, index, current) {
        return this.goalsService.updateKeyResult(id, user.org_id, parseInt(index), current);
    }
    remove(user, id) {
        return this.goalsService.remove(id, user.org_id);
    }
};
exports.GoalsController = GoalsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_goal_dto_1.CreateGoalDto]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('alignment'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "getAlignment", null);
__decorate([
    (0, common_1.Get)('progress-report'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "getProgressReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_goal_dto_1.UpdateGoalDto]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/key-results/:index'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('index')),
    __param(3, (0, common_1.Body)('current')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "updateKeyResult", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "remove", null);
exports.GoalsController = GoalsController = __decorate([
    (0, common_1.Controller)('goals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [goals_service_1.GoalsService])
], GoalsController);
//# sourceMappingURL=goals.controller.js.map