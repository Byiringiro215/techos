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
exports.MeetingsController = void 0;
const common_1 = require("@nestjs/common");
const meetings_service_1 = require("./meetings.service");
const create_meeting_dto_1 = require("./dto/create-meeting.dto");
const update_meeting_dto_1 = require("./dto/update-meeting.dto");
const create_action_item_dto_1 = require("./dto/create-action-item.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let MeetingsController = class MeetingsController {
    meetingsService;
    constructor(meetingsService) {
        this.meetingsService = meetingsService;
    }
    create(user, createMeetingDto) {
        return this.meetingsService.create(user.org_id, user, createMeetingDto);
    }
    findAll(user, filters) {
        return this.meetingsService.findAll(user.org_id, user, filters);
    }
    findOne(user, id) {
        return this.meetingsService.findOne(id, user.org_id, user);
    }
    update(user, id, updateMeetingDto) {
        return this.meetingsService.update(id, user.org_id, updateMeetingDto, user);
    }
    remove(user, id) {
        return this.meetingsService.remove(id, user.org_id, user);
    }
    addParticipants(user, id, body) {
        return this.meetingsService.addParticipants(id, user.org_id, body.participant_ids);
    }
    removeParticipant(user, id, userId) {
        return this.meetingsService.removeParticipant(id, user.org_id, userId);
    }
    updateParticipantStatus(id, userId, body) {
        return this.meetingsService.updateParticipantStatus(id, userId, body.status);
    }
    createActionItem(user, id, createActionItemDto) {
        return this.meetingsService.createActionItem(id, user.org_id, createActionItemDto);
    }
    getActionItems(user, id) {
        return this.meetingsService.getActionItems(id, user.org_id);
    }
    updateActionItem(id, actionItemId, updateData) {
        return this.meetingsService.updateActionItem(actionItemId, id, updateData);
    }
    updateActionItemById(user, id, updateData) {
        return this.meetingsService.updateActionItemById(id, user.org_id, updateData);
    }
    deleteActionItem(id, actionItemId) {
        return this.meetingsService.deleteActionItem(actionItemId, id);
    }
};
exports.MeetingsController = MeetingsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_meeting_dto_1.CreateMeetingDto]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_meeting_dto_1.UpdateMeetingDto]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/participants'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "addParticipants", null);
__decorate([
    (0, common_1.Delete)(':id/participants/:userId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "removeParticipant", null);
__decorate([
    (0, common_1.Put)(':id/participants/:userId/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "updateParticipantStatus", null);
__decorate([
    (0, common_1.Post)(':id/action-items'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_action_item_dto_1.CreateActionItemDto]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "createActionItem", null);
__decorate([
    (0, common_1.Get)(':id/action-items'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "getActionItems", null);
__decorate([
    (0, common_1.Put)(':id/action-items/:actionItemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('actionItemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "updateActionItem", null);
__decorate([
    (0, common_1.Put)('action-items/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "updateActionItemById", null);
__decorate([
    (0, common_1.Delete)(':id/action-items/:actionItemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('actionItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "deleteActionItem", null);
exports.MeetingsController = MeetingsController = __decorate([
    (0, common_1.Controller)('meetings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [meetings_service_1.MeetingsService])
], MeetingsController);
//# sourceMappingURL=meetings.controller.js.map