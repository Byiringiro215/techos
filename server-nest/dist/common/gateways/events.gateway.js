"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EventsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const socket_io_1 = require("socket.io");
const jwt = __importStar(require("jsonwebtoken"));
let EventsGateway = EventsGateway_1 = class EventsGateway {
    configService;
    server;
    logger = new common_1.Logger(EventsGateway_1.name);
    userSockets = new Map();
    constructor(configService) {
        this.configService = configService;
    }
    extractToken(client) {
        const authToken = client.handshake.auth?.token;
        if (typeof authToken === 'string' && authToken)
            return authToken;
        const queryToken = client.handshake.query?.token;
        if (typeof queryToken === 'string' && queryToken)
            return queryToken;
        const header = client.handshake.headers?.authorization;
        if (typeof header === 'string' && header.startsWith('Bearer ')) {
            return header.slice(7);
        }
        return null;
    }
    verifyUser(client) {
        const token = this.extractToken(client);
        const secret = this.configService.get('JWT_SECRET');
        if (token && secret) {
            try {
                const payload = jwt.verify(token, secret);
                if (payload?.sub) {
                    return {
                        userId: payload.sub,
                        orgId: payload.org_id,
                        email: payload.email,
                    };
                }
            }
            catch {
                this.logger.warn(`Socket ${client.id} presented an invalid JWT`);
            }
        }
        const queryUserId = client.handshake.query?.userId;
        if (typeof queryUserId === 'string' && queryUserId) {
            return { userId: queryUserId };
        }
        return null;
    }
    handleConnection(client) {
        const user = this.verifyUser(client);
        if (!user) {
            this.logger.warn(`Rejecting unauthenticated socket ${client.id}`);
            client.disconnect(true);
            return;
        }
        client.data.userId = user.userId;
        client.data.orgId = user.orgId;
        const sockets = this.userSockets.get(user.userId) || new Set();
        sockets.add(client.id);
        this.userSockets.set(user.userId, sockets);
        if (user.orgId) {
            client.join(`org:${user.orgId}`);
        }
        this.logger.log(`User ${user.userId} connected (${client.id})`);
    }
    handleDisconnect(client) {
        const userId = client.data?.userId;
        if (!userId)
            return;
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.delete(client.id);
            if (sockets.size === 0)
                this.userSockets.delete(userId);
            else
                this.userSockets.set(userId, sockets);
        }
        this.logger.log(`User ${userId} disconnected (${client.id})`);
    }
    handleJoinChannel(data, client) {
        if (!data?.channelId)
            return { success: false };
        client.join(`channel:${data.channelId}`);
        return { success: true, message: `Joined channel ${data.channelId}` };
    }
    handleLeaveChannel(data, client) {
        if (!data?.channelId)
            return { success: false };
        client.leave(`channel:${data.channelId}`);
        return { success: true, message: `Left channel ${data.channelId}` };
    }
    handleJoinOrg(data, client) {
        const orgId = data?.orgId || client.data?.orgId;
        if (!orgId)
            return { success: false };
        client.join(`org:${orgId}`);
        return { success: true };
    }
    handleJoinProject(data, client) {
        if (!data?.projectId)
            return { success: false };
        client.join(`project:${data.projectId}`);
        return { success: true };
    }
    handleLeaveProject(data, client) {
        if (!data?.projectId)
            return { success: false };
        client.leave(`project:${data.projectId}`);
        return { success: true };
    }
    sendMessageToChannel(channelId, message) {
        this.server.to(`channel:${channelId}`).emit('newMessage', message);
    }
    sendNotificationToUser(userId, notification) {
        const sockets = this.userSockets.get(userId);
        if (!sockets?.size)
            return;
        sockets.forEach((socketId) => {
            this.server.to(socketId).emit('notification', notification);
        });
    }
    sendNotificationToUsers(userIds, notification) {
        userIds.forEach((userId) => this.sendNotificationToUser(userId, notification));
    }
    sendToOrganization(orgId, event, data) {
        this.server.to(`org:${orgId}`).emit(event, data);
    }
    handleTyping(data, client) {
        const userId = client.data?.userId || data.userId;
        if (!data?.channelId || !userId)
            return;
        client.to(`channel:${data.channelId}`).emit('userTyping', {
            userId,
            userName: data.userName,
            channelId: data.channelId,
        });
    }
    handleStopTyping(data, client) {
        const userId = client.data?.userId || data.userId;
        if (!data?.channelId || !userId)
            return;
        client.to(`channel:${data.channelId}`).emit('userStoppedTyping', {
            userId,
            channelId: data.channelId,
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
    (0, websockets_1.SubscribeMessage)('joinOrg'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleJoinOrg", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinProject'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleJoinProject", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveProject'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLeaveProject", null);
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
exports.EventsGateway = EventsGateway = EventsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'http://localhost:5173',
                'http://127.0.0.1:5173',
            ],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map