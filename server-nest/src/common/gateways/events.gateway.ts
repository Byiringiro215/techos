import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.userSockets.entries())
      .find(([_, socketId]) => socketId === client.id)?.[0];
    
    if (userId) {
      this.userSockets.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  // Join a channel/room
  @SubscribeMessage('joinChannel')
  handleJoinChannel(
    @MessageBody() data: { channelId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`channel:${data.channelId}`);
    return { success: true, message: `Joined channel ${data.channelId}` };
  }

  // Leave a channel/room
  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(
    @MessageBody() data: { channelId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`channel:${data.channelId}`);
    return { success: true, message: `Left channel ${data.channelId}` };
  }

  // Send message to specific channel
  sendMessageToChannel(channelId: string, message: any) {
    this.server.to(`channel:${channelId}`).emit('newMessage', message);
  }

  // Send notification to specific user
  sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  // Send notification to multiple users
  sendNotificationToUsers(userIds: string[], notification: any) {
    userIds.forEach((userId) => {
      this.sendNotificationToUser(userId, notification);
    });
  }

  // Broadcast to organization
  sendToOrganization(orgId: string, event: string, data: any) {
    this.server.to(`org:${orgId}`).emit(event, data);
  }

  // User typing indicator
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { channelId: string; userId: string; userName: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`channel:${data.channelId}`).emit('userTyping', {
      userId: data.userId,
      userName: data.userName,
    });
  }

  // User stopped typing
  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @MessageBody() data: { channelId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`channel:${data.channelId}`).emit('userStoppedTyping', {
      userId: data.userId,
    });
  }

  // Task update real-time
  sendTaskUpdate(projectId: string, task: any) {
    this.server.to(`project:${projectId}`).emit('taskUpdated', task);
  }

  // Project update real-time
  sendProjectUpdate(orgId: string, project: any) {
    this.server.to(`org:${orgId}`).emit('projectUpdated', project);
  }
}
