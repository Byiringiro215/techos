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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const channels_service_1 = require("./channels.service");
const create_channel_dto_1 = require("./dto/create-channel.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const messages_service_1 = require("../messages/messages.service");
let ChannelsController = class ChannelsController {
    channelsService;
    messagesService;
    constructor(channelsService, messagesService) {
        this.channelsService = channelsService;
        this.messagesService = messagesService;
    }
    create(user, createChannelDto) {
        return this.channelsService.create(user.org_id, user.id, createChannelDto);
    }
    openDirect(user, body) {
        return this.channelsService.findOrCreateDirect(user.org_id, user.id, body.user_id);
    }
    findAll(user) {
        return this.channelsService.findAll(user.org_id, user.id);
    }
    findOne(user, id) {
        return this.channelsService.findOne(id, user.org_id, user.id);
    }
    update(user, id, updateData) {
        return this.channelsService.update(id, user.org_id, user.id, updateData);
    }
    remove(user, id) {
        return this.channelsService.remove(id, user.org_id, user.id);
    }
    addMembers(user, id, body) {
        return this.channelsService.addMembers(id, user.org_id, user.id, body.member_ids);
    }
    removeMember(user, id, userId) {
        return this.channelsService.removeMember(id, user.org_id, user.id, userId);
    }
    markAsRead(user, id) {
        return this.channelsService.updateLastRead(id, user.id);
    }
    getChannelMessages(user, id, limit, before) {
        return this.messagesService.findAll(id, user.id, limit, before);
    }
    postChannelMessage(user, id, body) {
        return this.messagesService.create(user.id, {
            channel_id: id,
            content: body.content,
            parent_message_id: body.parent_message_id,
            mentions: body.mentions,
        });
    }
};
exports.ChannelsController = ChannelsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_channel_dto_1.CreateChannelDto]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('direct'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "openDirect", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "addMembers", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Put)(':id/read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('before')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, String]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getChannelMessages", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "postChannelMessage", null);
exports.ChannelsController = ChannelsController = __decorate([
    (0, common_1.Controller)('channels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService,
        messages_service_1.MessagesService])
], ChannelsController);
//# sourceMappingURL=channels.controller.js.map