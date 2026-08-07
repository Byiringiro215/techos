import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private configService;
    server: Server;
    private readonly logger;
    private userSockets;
    constructor(configService: ConfigService);
    private extractToken;
    private verifyUser;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinChannel(data: {
        channelId: string;
    }, client: Socket): {
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    };
    handleLeaveChannel(data: {
        channelId: string;
    }, client: Socket): {
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    };
    handleJoinOrg(data: {
        orgId: string;
    }, client: Socket): {
        success: boolean;
    };
    handleJoinProject(data: {
        projectId: string;
    }, client: Socket): {
        success: boolean;
    };
    handleLeaveProject(data: {
        projectId: string;
    }, client: Socket): {
        success: boolean;
    };
    sendMessageToChannel(channelId: string, message: any): void;
    sendNotificationToUser(userId: string, notification: any): void;
    sendNotificationToUsers(userIds: string[], notification: any): void;
    sendToOrganization(orgId: string, event: string, data: any): void;
    handleTyping(data: {
        channelId: string;
        userId?: string;
        userName: string;
    }, client: Socket): void;
    handleStopTyping(data: {
        channelId: string;
        userId?: string;
    }, client: Socket): void;
    sendTaskUpdate(projectId: string, task: any): void;
    sendProjectUpdate(orgId: string, project: any): void;
}
