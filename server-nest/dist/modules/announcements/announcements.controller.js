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
exports.AnnouncementsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const announcements_service_1 = require("./announcements.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const create_announcement_dto_1 = require("./dto/create-announcement.dto");
const update_announcement_dto_1 = require("./dto/update-announcement.dto");
let AnnouncementsController = class AnnouncementsController {
    announcementsService;
    constructor(announcementsService) {
        this.announcementsService = announcementsService;
    }
    create(user, createDto) {
        return this.announcementsService.create(user.org_id, user.id, createDto);
    }
    findAll(user, filters) {
        return this.announcementsService.findAll(user.org_id, filters);
    }
    getPinned(user) {
        return this.announcementsService.getPinned(user.org_id);
    }
    findOne(user, id) {
        return this.announcementsService.findOne(id, user.org_id);
    }
    update(user, id, updateDto) {
        return this.announcementsService.update(id, user.org_id, updateDto);
    }
    togglePin(user, id) {
        return this.announcementsService.togglePin(id, user.org_id);
    }
    pin(user, id) {
        return this.announcementsService.setPinStatus(id, user.org_id, true);
    }
    unpin(user, id) {
        return this.announcementsService.setPinStatus(id, user.org_id, false);
    }
    remove(user, id) {
        return this.announcementsService.remove(id, user.org_id);
    }
};
exports.AnnouncementsController = AnnouncementsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_announcement_dto_1.CreateAnnouncementDto]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pinned'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "getPinned", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_announcement_dto_1.UpdateAnnouncementDto]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-pin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "togglePin", null);
__decorate([
    (0, common_1.Post)(':id/pin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "pin", null);
__decorate([
    (0, common_1.Post)(':id/unpin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "unpin", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "remove", null);
exports.AnnouncementsController = AnnouncementsController = __decorate([
    (0, common_1.Controller)('announcements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [announcements_service_1.AnnouncementsService])
], AnnouncementsController);
//# sourceMappingURL=announcements.controller.js.map