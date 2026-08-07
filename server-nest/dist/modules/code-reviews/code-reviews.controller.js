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
exports.CodeReviewsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const code_reviews_service_1 = require("./code-reviews.service");
let CodeReviewsController = class CodeReviewsController {
    codeReviewsService;
    constructor(codeReviewsService) {
        this.codeReviewsService = codeReviewsService;
    }
    previewPr(user, body) {
        return this.codeReviewsService.previewPr(user.org_id, body?.pr_url || '');
    }
    create(user, body) {
        return this.codeReviewsService.create(user.org_id, user, body);
    }
    findAll(user, query) {
        return this.codeReviewsService.findAll(user.org_id, user, query);
    }
    findOne(user, id) {
        return this.codeReviewsService.findOne(id, user.org_id);
    }
    update(user, id, body) {
        return this.codeReviewsService.update(id, user.org_id, user, body);
    }
    decide(user, id, body) {
        return this.codeReviewsService.decide(id, user.org_id, user, body?.status || '');
    }
    sync(user, id) {
        return this.codeReviewsService.syncFromPr(id, user.org_id, user);
    }
    remove(user, id) {
        return this.codeReviewsService.remove(id, user.org_id, user);
    }
};
exports.CodeReviewsController = CodeReviewsController;
__decorate([
    (0, common_1.Post)('preview-pr'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CodeReviewsController.prototype, "previewPr", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CodeReviewsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CodeReviewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CodeReviewsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CodeReviewsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/decide'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CodeReviewsController.prototype, "decide", null);
__decorate([
    (0, common_1.Post)(':id/sync'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CodeReviewsController.prototype, "sync", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CodeReviewsController.prototype, "remove", null);
exports.CodeReviewsController = CodeReviewsController = __decorate([
    (0, common_1.Controller)('code-reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [code_reviews_service_1.CodeReviewsService])
], CodeReviewsController);
//# sourceMappingURL=code-reviews.controller.js.map