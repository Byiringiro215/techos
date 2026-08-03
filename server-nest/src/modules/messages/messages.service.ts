import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Message } from '../../entities/message.entity';
import { Channel } from '../../entities/channel.entity';
import { ChannelMember } from '../../entities/channel-member.entity';
import { User } from '../../entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { EventsGateway } from '../../common/gateways/events.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private channelMembersRepository: Repository<ChannelMember>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private eventsGateway: EventsGateway,
  ) {}

  async create(user_id: string, createMessageDto: CreateMessageDto) {
    const { channel_id } = createMessageDto;

    // Verify channel exists
    const channel = await this.channelsRepository.findOne({
      where: { id: channel_id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    // Verify user is member of channel
    const membership = await this.channelMembersRepository.findOne({
      where: { channel_id, user_id },
    });

    if (!membership && channel.type === 'private') {
      throw new ForbiddenException('You are not a member of this channel');
    }

    // Create message
    const message = this.messagesRepository.create({
      id: randomUUID(),
      user_id,
      ...createMessageDto,
    });

    await this.messagesRepository.save(message);

    // Get message with user details
    const messageWithUser = await this.getMessageWithUser(message.id);

    // Send real-time update
    this.eventsGateway.sendMessageToChannel(channel_id, messageWithUser);

    // Send notifications to mentioned users
    if (createMessageDto.mentions && createMessageDto.mentions.length > 0) {
      await this.notifyMentionedUsers(
        createMessageDto.mentions,
        user_id,
        channel_id,
        message.content,
      );
    }

    return {
      success: true,
      data: messageWithUser,
    };
  }

  async findAll(channel_id: string, user_id: string, limit: number = 50, before?: string) {
    // Verify user has access to channel
    const channel = await this.channelsRepository.findOne({
      where: { id: channel_id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    const membership = await this.channelMembersRepository.findOne({
      where: { channel_id, user_id },
    });

    if (!membership && channel.type === 'private') {
      throw new ForbiddenException('You do not have access to this channel');
    }

    // Build query
    let query = this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(User, 'user', 'message.user_id = user.id')
      .where('message.channel_id = :channel_id', { channel_id })
      .andWhere('message.is_deleted = :is_deleted', { is_deleted: false })
      .orderBy('message.created_at', 'DESC')
      .limit(limit);

    if (before) {
      query = query.andWhere('message.created_at < :before', { before });
    }

    const messages = await query
      .select([
        'message.*',
        'user.id as user_id',
        'user.first_name as user_first_name',
        'user.last_name as user_last_name',
        'user.avatar as user_avatar',
      ])
      .getRawMany();

    // Get thread counts for messages
    const messagesWithThreads = await Promise.all(
      messages.map(async (msg) => {
        const threadCount = await this.messagesRepository.count({
          where: { parent_message_id: msg.id, is_deleted: false },
        });

        return {
          ...msg,
          thread_count: threadCount,
        };
      }),
    );

    return {
      success: true,
      data: messagesWithThreads.reverse(), // Return in chronological order
    };
  }

  async findOne(id: string, user_id: string) {
    const message = await this.getMessageWithUser(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify user has access
    const channel = await this.channelsRepository.findOne({
      where: { id: message.channel_id },
    });

    const membership = await this.channelMembersRepository.findOne({
      where: { channel_id: message.channel_id, user_id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (!membership && channel.type === 'private') {
      throw new ForbiddenException('You do not have access to this message');
    }

    return {
      success: true,
      data: message,
    };
  }

  async update(id: string, user_id: string, content: string) {
    const message = await this.messagesRepository.findOne({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.user_id !== user_id) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    message.content = content;
    message.is_edited = true;
    message.edited_at = new Date();

    await this.messagesRepository.save(message);

    const updatedMessage = await this.getMessageWithUser(id);

    // Send real-time update
    this.eventsGateway.sendMessageToChannel(message.channel_id, {
      ...updatedMessage,
      event: 'messageUpdated',
    });

    return {
      success: true,
      data: updatedMessage,
    };
  }

  async remove(id: string, user_id: string) {
    const message = await this.messagesRepository.findOne({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user is message author or channel admin
    const membership = await this.channelMembersRepository.findOne({
      where: { channel_id: message.channel_id, user_id },
    });

    if (message.user_id !== user_id && (!membership || membership.role !== 'admin')) {
      throw new ForbiddenException('You do not have permission to delete this message');
    }

    message.is_deleted = true;
    await this.messagesRepository.save(message);

    // Send real-time update
    this.eventsGateway.sendMessageToChannel(message.channel_id, {
      id: message.id,
      event: 'messageDeleted',
    });

    return {
      success: true,
      message: 'Message deleted successfully',
    };
  }

  // Reactions
  async addReaction(message_id: string, user_id: string, emoji: string) {
    const message = await this.messagesRepository.findOne({
      where: { id: message_id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Initialize reactions if null
    if (!message.reactions) {
      message.reactions = {};
    }

    // Add user to emoji reactions
    if (!message.reactions[emoji]) {
      message.reactions[emoji] = [];
    }

    if (!message.reactions[emoji].includes(user_id)) {
      message.reactions[emoji].push(user_id);
    }

    await this.messagesRepository.save(message);

    // Send real-time update
    this.eventsGateway.sendMessageToChannel(message.channel_id, {
      message_id,
      emoji,
      user_id,
      reactions: message.reactions,
      event: 'reactionAdded',
    });

    return {
      success: true,
      data: { reactions: message.reactions },
    };
  }

  async removeReaction(message_id: string, user_id: string, emoji: string) {
    const message = await this.messagesRepository.findOne({
      where: { id: message_id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.reactions && message.reactions[emoji]) {
      message.reactions[emoji] = message.reactions[emoji].filter((id) => id !== user_id);

      if (message.reactions[emoji].length === 0) {
        delete message.reactions[emoji];
      }
    }

    await this.messagesRepository.save(message);

    // Send real-time update
    this.eventsGateway.sendMessageToChannel(message.channel_id, {
      message_id,
      emoji,
      user_id,
      reactions: message.reactions,
      event: 'reactionRemoved',
    });

    return {
      success: true,
      data: { reactions: message.reactions },
    };
  }

  // Threads
  async getThread(parent_message_id: string, user_id: string) {
    const parentMessage = await this.messagesRepository.findOne({
      where: { id: parent_message_id },
    });

    if (!parentMessage) {
      throw new NotFoundException('Parent message not found');
    }

    // Verify access
    const channel = await this.channelsRepository.findOne({
      where: { id: parentMessage.channel_id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    const membership = await this.channelMembersRepository.findOne({
      where: { channel_id: parentMessage.channel_id, user_id },
    });

    if (!membership && channel.type === 'private') {
      throw new ForbiddenException('You do not have access to this thread');
    }

    const replies = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(User, 'user', 'message.user_id = user.id')
      .where('message.parent_message_id = :parent_message_id', { parent_message_id })
      .andWhere('message.is_deleted = :is_deleted', { is_deleted: false })
      .orderBy('message.created_at', 'ASC')
      .select([
        'message.*',
        'user.id as user_id',
        'user.first_name as user_first_name',
        'user.last_name as user_last_name',
        'user.avatar as user_avatar',
      ])
      .getRawMany();

    return {
      success: true,
      data: replies,
    };
  }

  // Search messages
  async search(channel_id: string, user_id: string, query: string) {
    // Verify access
    const channel = await this.channelsRepository.findOne({
      where: { id: channel_id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    const membership = await this.channelMembersRepository.findOne({
      where: { channel_id, user_id },
    });

    if (!membership && channel.type === 'private') {
      throw new ForbiddenException('You do not have access to this channel');
    }

    const messages = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(User, 'user', 'message.user_id = user.id')
      .where('message.channel_id = :channel_id', { channel_id })
      .andWhere('message.content LIKE :query', { query: `%${query}%` })
      .andWhere('message.is_deleted = :is_deleted', { is_deleted: false })
      .orderBy('message.created_at', 'DESC')
      .limit(50)
      .select([
        'message.*',
        'user.first_name as user_first_name',
        'user.last_name as user_last_name',
        'user.avatar as user_avatar',
      ])
      .getRawMany();

    return {
      success: true,
      data: messages,
    };
  }

  // Helper methods
  private async getMessageWithUser(message_id: string) {
    const result = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(User, 'user', 'message.user_id = user.id')
      .where('message.id = :message_id', { message_id })
      .select([
        'message.*',
        'user.id as user_id',
        'user.first_name as user_first_name',
        'user.last_name as user_last_name',
        'user.avatar as user_avatar',
      ])
      .getRawOne();

    return result;
  }

  private async notifyMentionedUsers(
    mention_ids: string[],
    sender_id: string,
    channel_id: string,
    content: string,
  ) {
    // This will be implemented when NotificationsService is complete
    // For now, just send real-time notifications
    const sender = await this.usersRepository.findOne({ where: { id: sender_id } });
    const channel = await this.channelsRepository.findOne({ where: { id: channel_id } });

    mention_ids.forEach((userId) => {
      this.eventsGateway.sendNotificationToUser(userId, {
        type: 'mention',
        title: `${sender?.first_name} ${sender?.last_name} mentioned you`,
        message: content.substring(0, 100),
        channel_id,
        channel_name: channel?.name,
      });
    });
  }
}
