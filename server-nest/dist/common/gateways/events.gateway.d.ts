import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private userSockets;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinChannel(data: {
        channelId: string;
    }, client: Socket): {
        success: boolean;
        message: string;
    };
    handleLeaveChannel(data: {
        channelId: string;
    }, client: Socket): {
        success: boolean;
        message: string;
    };
    sendMessageToChannel(channelId: string, message: any): void;
    sendNotificationToUser(userId: string, notification: any): void;
    sendNotificationToUsers(userIds: string[], notification: any): void;
    sendToOrganization(orgId: string, event: string, data: any): void;
    handleTyping(data: {
        channelId: string;
        userId: string;
        userName: string;
    }, client: Socket): void;
    handleStopTyping(data: {
        channelId: string;
        userId: string;
    }, client: Socket): void;
    sendTaskUpdate(projectId: string, task: any): void;
    sendProjectUpdate(orgId: string, project: any): void;
}
