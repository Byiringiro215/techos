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
exports.WorkspaceController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const workspace_service_1 = require("./workspace.service");
const create_workspace_record_dto_1 = require("./dto/create-workspace-record.dto");
let WorkspaceController = class WorkspaceController {
    workspaceService;
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    listActivity(user, entity_type, entity_id, actor_id) {
        return this.workspaceService.listActivity(user.org_id, entity_type, entity_id, actor_id);
    }
    list(user, type) {
        return this.workspaceService.list(user.org_id, type);
    }
    get(user, type, id) {
        return this.workspaceService.get(user.org_id, type, id);
    }
    create(user, type, dto) {
        return this.workspaceService.create(user.org_id, type, user, dto);
    }
    update(user, type, id, dto) {
        return this.workspaceService.update(user.org_id, type, id, user, dto);
    }
    remove(user, type, id) {
        return this.workspaceService.remove(user.org_id, type, id, user);
    }
};
exports.WorkspaceController = WorkspaceController;
__decorate([
    (0, common_1.Get)('activity'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('entity_type')),
    __param(2, (0, common_1.Query)('entity_id')),
    __param(3, (0, common_1.Query)('actor_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "listActivity", null);
__decorate([
    (0, common_1.Get)(':type'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':type/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(':type'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_workspace_record_dto_1.CreateWorkspaceRecordDto]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':type/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, create_workspace_record_dto_1.CreateWorkspaceRecordDto]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':type/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "remove", null);
exports.WorkspaceController = WorkspaceController = __decorate([
    (0, common_1.Controller)('workspace'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [workspace_service_1.WorkspaceService])
], WorkspaceController);
//# sourceMappingURL=workspace.controller.js.map