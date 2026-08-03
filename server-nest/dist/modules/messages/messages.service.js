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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const message_entity_1 = require("../../entities/message.entity");
const channel_entity_1 = require("../../entities/channel.entity");
const channel_member_entity_1 = require("../../entities/channel-member.entity");
const user_entity_1 = require("../../entities/user.entity");
const events_gateway_1 = require("../../common/gateways/events.gateway");
let MessagesService = class MessagesService {
    messagesRepository;
    channelsRepository;
    channelMembersRepository;
    usersRepository;
    eventsGateway;
    constructor(messagesRepository, channelsRepository, channelMembersRepository, usersRepository, eventsGateway) {
        this.messagesRepository = messagesRepository;
        this.channelsRepository = channelsRepository;
        this.channelMembersRepository = channelMembersRepository;
        this.usersRepository = usersRepository;
        this.eventsGateway = eventsGateway;
    }
    async create(user_id, createMessageDto) {
        const { channel_id } = createMessageDto;
        const channel = await this.channelsRepository.findOne({
            where: { id: channel_id },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        const membership = await this.channelMembersRepository.findOne({
            where: { channel_id, user_id },
        });
        if (!membership && channel.type === 'private') {
            throw new common_1.ForbiddenException('You are not a member of this channel');
        }
        const message = this.messagesRepository.create({
            id: (0, crypto_1.randomUUID)(),
            user_id,
            ...createMessageDto,
        });
        await this.messagesRepository.save(message);
        const messageWithUser = await this.getMessageWithUser(message.id);
        this.eventsGateway.sendMessageToChannel(channel_id, messageWithUser);
        if (createMessageDto.mentions && createMessageDto.mentions.length > 0) {
            await this.notifyMentionedUsers(createMessageDto.mentions, user_id, channel_id, message.content);
        }
        return {
            success: true,
            data: messageWithUser,
        };
    }
    async findAll(channel_id, user_id, limit = 50, before) {
        const channel = await this.channelsRepository.findOne({
            where: { id: channel_id },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        const membership = await this.channelMembersRepository.findOne({
            where: { channel_id, user_id },
        });
        if (!membership && channel.type === 'private') {
            throw new common_1.ForbiddenException('You do not have access to this channel');
        }
        let query = this.messagesRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'message.user_id = user.id')
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
        const messagesWithThreads = await Promise.all(messages.map(async (msg) => {
            const threadCount = await this.messagesRepository.count({
                where: { parent_message_id: msg.id, is_deleted: false },
            });
            return {
                ...msg,
                thread_count: threadCount,
            };
        }));
        return {
            success: true,
            data: messagesWithThreads.reverse(),
        };
    }
    async findOne(id, user_id) {
        const message = await this.getMessageWithUser(id);
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        const channel = await this.channelsRepository.findOne({
            where: { id: message.channel_id },
        });
        const membership = await this.channelMembersRepository.findOne({
            where: { channel_id: message.channel_id, user_id },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        if (!membership && channel.type === 'private') {
            throw new common_1.ForbiddenException('You do not have access to this message');
        }
        return {
            success: true,
            data: message,
        };
    }
    async update(id, user_id, content) {
        const message = await this.messagesRepository.findOne({
            where: { id },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.user_id !== user_id) {
            throw new common_1.ForbiddenException('You can only edit your own messages');
        }
        message.content = content;
        message.is_edited = true;
        message.edited_at = new Date();
        await this.messagesRepository.save(message);
        const updatedMessage = await this.getMessageWithUser(id);
        this.eventsGateway.sendMessageToChannel(message.channel_id, {
            ...updatedMessage,
            event: 'messageUpdated',
        });
        return {
            success: true,
            data: updatedMessage,
        };
    }
    async remove(id, user_id) {
        const message = await this.messagesRepository.findOne({
            where: { id },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        const membership = await this.channelMembersRepository.findOne({
            where: { channel_id: message.channel_id, user_id },
        });
        if (message.user_id !== user_id && (!membership || membership.role !== 'admin')) {
            throw new common_1.ForbiddenException('You do not have permission to delete this message');
        }
        message.is_deleted = true;
        await this.messagesRepository.save(message);
        this.eventsGateway.sendMessageToChannel(message.channel_id, {
            id: message.id,
            event: 'messageDeleted',
        });
        return {
            success: true,
            message: 'Message deleted successfully',
        };
    }
    async addReaction(message_id, user_id, emoji) {
        const message = await this.messagesRepository.findOne({
            where: { id: message_id },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (!message.reactions) {
            message.reactions = {};
        }
        if (!message.reactions[emoji]) {
            message.reactions[emoji] = [];
        }
        if (!message.reactions[emoji].includes(user_id)) {
            message.reactions[emoji].push(user_id);
        }
        await this.messagesRepository.save(message);
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
    async removeReaction(message_id, user_id, emoji) {
        const message = await this.messagesRepository.findOne({
            where: { id: message_id },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.reactions && message.reactions[emoji]) {
            message.reactions[emoji] = message.reactions[emoji].filter((id) => id !== user_id);
            if (message.reactions[emoji].length === 0) {
                delete message.reactions[emoji];
            }
        }
        await this.messagesRepository.save(message);
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
    async getThread(parent_message_id, user_id) {
        const parentMessage = await this.messagesRepository.findOne({
            where: { id: parent_message_id },
        });
        if (!parentMessage) {
            throw new common_1.NotFoundException('Parent message not found');
        }
        const channel = await this.channelsRepository.findOne({
            where: { id: parentMessage.channel_id },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        const membership = await this.channelMembersRepository.findOne({
            where: { channel_id: parentMessage.channel_id, user_id },
        });
        if (!membership && channel.type === 'private') {
            throw new common_1.ForbiddenException('You do not have access to this thread');
        }
        const replies = await this.messagesRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'message.user_id = user.id')
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
    async search(channel_id, user_id, query) {
        const channel = await this.channelsRepository.findOne({
            where: { id: channel_id },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        const membership = await this.channelMembersRepository.findOne({
            where: { channel_id, user_id },
        });
        if (!membership && channel.type === 'private') {
            throw new common_1.ForbiddenException('You do not have access to this channel');
        }
        const messages = await this.messagesRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'message.user_id = user.id')
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
    async getMessageWithUser(message_id) {
        const result = await this.messagesRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'message.user_id = user.id')
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
    async notifyMentionedUsers(mention_ids, sender_id, channel_id, content) {
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __param(2, (0, typeorm_1.InjectRepository)(channel_member_entity_1.ChannelMember)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        events_gateway_1.EventsGateway])
], MessagesService);
//# sourceMappingURL=messages.service.js.map