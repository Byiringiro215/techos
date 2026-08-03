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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const product_service_1 = require("./product.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    createFeature(user, createDto) {
        return this.productService.createFeature(user.org_id, createDto);
    }
    findAllFeatures(user, filters) {
        return this.productService.findAllFeatures(user.org_id, filters);
    }
    findOneFeature(user, id) {
        return this.productService.findOneFeature(id, user.org_id);
    }
    updateFeature(user, id, updateDto) {
        return this.productService.updateFeature(id, user.org_id, updateDto);
    }
    voteFeature(user, id) {
        return this.productService.voteFeature(id, user.org_id);
    }
    removeFeature(user, id) {
        return this.productService.removeFeature(id, user.org_id);
    }
    createEpic(user, createDto) {
        return this.productService.createEpic(user.org_id, createDto);
    }
    findAllEpics(user, filters) {
        return this.productService.findAllEpics(user.org_id, filters);
    }
    findOneEpic(user, id) {
        return this.productService.findOneEpic(id, user.org_id);
    }
    updateEpic(user, id, updateDto) {
        return this.productService.updateEpic(id, user.org_id, updateDto);
    }
    removeEpic(user, id) {
        return this.productService.removeEpic(id, user.org_id);
    }
    createBug(user, createDto) {
        return this.productService.createBug(user.org_id, user.id, createDto);
    }
    findAllBugs(user, filters) {
        return this.productService.findAllBugs(user.org_id, filters);
    }
    findOneBug(user, id) {
        return this.productService.findOneBug(id, user.org_id);
    }
    updateBug(user, id, updateDto) {
        return this.productService.updateBug(id, user.org_id, updateDto);
    }
    removeBug(user, id) {
        return this.productService.removeBug(id, user.org_id);
    }
    createRelease(user, createDto) {
        return this.productService.createRelease(user.org_id, createDto);
    }
    findAllReleases(user, filters) {
        return this.productService.findAllReleases(user.org_id, filters);
    }
    findOneRelease(user, id) {
        return this.productService.findOneRelease(id, user.org_id);
    }
    updateRelease(user, id, updateDto) {
        return this.productService.updateRelease(id, user.org_id, updateDto);
    }
    removeRelease(user, id) {
        return this.productService.removeRelease(id, user.org_id);
    }
    createFeedback(user, createDto) {
        return this.productService.createFeedback(user.org_id, createDto);
    }
    findAllFeedback(user, filters) {
        return this.productService.findAllFeedback(user.org_id, filters);
    }
    findOneFeedback(user, id) {
        return this.productService.findOneFeedback(id, user.org_id);
    }
    updateFeedback(user, id, updateDto) {
        return this.productService.updateFeedback(id, user.org_id, updateDto);
    }
    removeFeedback(user, id) {
        return this.productService.removeFeedback(id, user.org_id);
    }
    createRoadmap(user, createDto) {
        return this.productService.createRoadmap(user.org_id, createDto);
    }
    findAllRoadmaps(user, filters) {
        return this.productService.findAllRoadmaps(user.org_id, filters);
    }
    findOneRoadmap(user, id) {
        return this.productService.findOneRoadmap(id, user.org_id);
    }
    updateRoadmap(user, id, updateDto) {
        return this.productService.updateRoadmap(id, user.org_id, updateDto);
    }
    removeRoadmap(user, id) {
        return this.productService.removeRoadmap(id, user.org_id);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)('features'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "createFeature", null);
__decorate([
    (0, common_1.Get)('features'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAllFeatures", null);
__decorate([
    (0, common_1.Get)('features/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOneFeature", null);
__decorate([
    (0, common_1.Put)('features/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateFeature", null);
__decorate([
    (0, common_1.Patch)('features/:id/vote'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "voteFeature", null);
__decorate([
    (0, common_1.Delete)('features/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "removeFeature", null);
__decorate([
    (0, common_1.Post)('epics'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "createEpic", null);
__decorate([
    (0, common_1.Get)('epics'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAllEpics", null);
__decorate([
    (0, common_1.Get)('epics/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOneEpic", null);
__decorate([
    (0, common_1.Put)('epics/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateEpic", null);
__decorate([
    (0, common_1.Delete)('epics/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "removeEpic", null);
__decorate([
    (0, common_1.Post)('bugs'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "createBug", null);
__decorate([
    (0, common_1.Get)('bugs'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAllBugs", null);
__decorate([
    (0, common_1.Get)('bugs/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOneBug", null);
__decorate([
    (0, common_1.Put)('bugs/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateBug", null);
__decorate([
    (0, common_1.Delete)('bugs/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "removeBug", null);
__decorate([
    (0, common_1.Post)('releases'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "createRelease", null);
__decorate([
    (0, common_1.Get)('releases'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAllReleases", null);
__decorate([
    (0, common_1.Get)('releases/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOneRelease", null);
__decorate([
    (0, common_1.Put)('releases/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateRelease", null);
__decorate([
    (0, common_1.Delete)('releases/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "removeRelease", null);
__decorate([
    (0, common_1.Post)('feedback'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "createFeedback", null);
__decorate([
    (0, common_1.Get)('feedback'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAllFeedback", null);
__decorate([
    (0, common_1.Get)('feedback/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOneFeedback", null);
__decorate([
    (0, common_1.Put)('feedback/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateFeedback", null);
__decorate([
    (0, common_1.Delete)('feedback/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "removeFeedback", null);
__decorate([
    (0, common_1.Post)('roadmaps'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "createRoadmap", null);
__decorate([
    (0, common_1.Get)('roadmaps'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAllRoadmaps", null);
__decorate([
    (0, common_1.Get)('roadmaps/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOneRoadmap", null);
__decorate([
    (0, common_1.Put)('roadmaps/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateRoadmap", null);
__decorate([
    (0, common_1.Delete)('roadmaps/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "removeRoadmap", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('product'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map