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
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let EventsGateway = class EventsGateway {
    server;
    userSockets = new Map();
    handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            this.userSockets.set(userId, client.id);
            console.log(`User ${userId} connected with socket ${client.id}`);
        }
    }
    handleDisconnect(client) {
        const userId = Array.from(this.userSockets.entries())
            .find(([_, socketId]) => socketId === client.id)?.[0];
        if (userId) {
            this.userSockets.delete(userId);
            console.log(`User ${userId} disconnected`);
        }
    }
    handleJoinChannel(data, client) {
        client.join(`channel:${data.channelId}`);
        return { success: true, message: `Joined channel ${data.channelId}` };
    }
    handleLeaveChannel(data, client) {
        client.leave(`channel:${data.channelId}`);
        return { success: true, message: `Left channel ${data.channelId}` };
    }
    sendMessageToChannel(channelId, message) {
        this.server.to(`channel:${channelId}`).emit('newMessage', message);
    }
    sendNotificationToUser(userId, notification) {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
            this.server.to(socketId).emit('notification', notification);
        }
    }
    sendNotificationToUsers(userIds, notification) {
        userIds.forEach((userId) => {
            this.sendNotificationToUser(userId, notification);
        });
    }
    sendToOrganization(orgId, event, data) {
        this.server.to(`org:${orgId}`).emit(event, data);
    }
    handleTyping(data, client) {
        client.to(`channel:${data.channelId}`).emit('userTyping', {
            userId: data.userId,
            userName: data.userName,
        });
    }
    handleStopTyping(data, client) {
        client.to(`channel:${data.channelId}`).emit('userStoppedTyping', {
            userId: data.userId,
        });
    }
    sendTaskUpdate(projectId, task) {
        this.server.to(`project:${projectId}`).emit('taskUpdated', task);
    }
    sendProjectUpdate(orgId, project) {
        this.server.to(`org:${orgId}`).emit('projectUpdated', project);
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleJoinChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLeaveChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stopTyping'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleStopTyping", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
            credentials: true,
        },
    })
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map