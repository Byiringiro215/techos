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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let MessagesController = class MessagesController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    create(user, createMessageDto) {
        return this.messagesService.create(user.id, createMessageDto);
    }
    findAll(user, channelId, limit, before) {
        return this.messagesService.findAll(channelId, user.id, limit, before);
    }
    findOne(user, id) {
        return this.messagesService.findOne(id, user.id);
    }
    update(user, id, body) {
        return this.messagesService.update(id, user.id, body.content);
    }
    remove(user, id) {
        return this.messagesService.remove(id, user.id);
    }
    addReaction(user, id, body) {
        return this.messagesService.addReaction(id, user.id, body.emoji);
    }
    removeReaction(user, id, emoji) {
        return this.messagesService.removeReaction(id, user.id, emoji);
    }
    getThread(user, id) {
        return this.messagesService.getThread(id, user.id);
    }
    search(user, channelId, query) {
        return this.messagesService.search(channelId, user.id, query);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('channel/:channelId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('channelId')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('before')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/reactions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "addReaction", null);
__decorate([
    (0, common_1.Delete)(':id/reactions/:emoji'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('emoji')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "removeReaction", null);
__decorate([
    (0, common_1.Get)(':id/thread'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "getThread", null);
__decorate([
    (0, common_1.Get)('channel/:channelId/search'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('channelId')),
    __param(2, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "search", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.Controller)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map