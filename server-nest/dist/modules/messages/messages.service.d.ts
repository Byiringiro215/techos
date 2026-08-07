import { Repository } from 'typeorm';
import { Message } from '../../entities/message.entity';
import { Channel } from '../../entities/channel.entity';
import { ChannelMember } from '../../entities/channel-member.entity';
import { User } from '../../entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { EventsGateway } from '../../common/gateways/events.gateway';
export declare class MessagesService {
    private messagesRepository;
    private channelsRepository;
    private channelMembersRepository;
    private usersRepository;
    private eventsGateway;
    constructor(messagesRepository: Repository<Message>, channelsRepository: Repository<Channel>, channelMembersRepository: Repository<ChannelMember>, usersRepository: Repository<User>, eventsGateway: EventsGateway);
    private formatMessage;
    create(user_id: string, createMessageDto: CreateMessageDto): Promise<{
        success: boolean;
        data: {
            id: string;
            channel_id: string;
            channelId: string;
            user_id: string;
            userId: string;
            sender_id: string;
            content: string;
            parent_message_id: string;
            attachments: string[];
            mentions: string[];
            reactions: Record<string, string[]>;
            is_edited: boolean;
            is_deleted: boolean;
            created_at: Date;
            createdAt: Date;
            updated_at: Date;
            user_first_name: string | null;
            user_last_name: string | null;
            user_avatar: string | null;
            user_name: string;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                avatar: string;
            } | undefined;
        } | null;
    }>;
    findAll(channel_id: string, user_id: string, limit?: number, before?: string): Promise<{
        success: boolean;
        data: {
            thread_count: number;
            id: string;
            channel_id: string;
            channelId: string;
            user_id: string;
            userId: string;
            sender_id: string;
            content: string;
            parent_message_id: string;
            attachments: string[];
            mentions: string[];
            reactions: Record<string, string[]>;
            is_edited: boolean;
            is_deleted: boolean;
            created_at: Date;
            createdAt: Date;
            updated_at: Date;
            user_first_name: string | null;
            user_last_name: string | null;
            user_avatar: string | null;
            user_name: string;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                avatar: string;
            } | undefined;
        }[];
    }>;
    findOne(id: string, user_id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            channel_id: string;
            channelId: string;
            user_id: string;
            userId: string;
            sender_id: string;
            content: string;
            parent_message_id: string;
            attachments: string[];
            mentions: string[];
            reactions: Record<string, string[]>;
            is_edited: boolean;
            is_deleted: boolean;
            created_at: Date;
            createdAt: Date;
            updated_at: Date;
            user_first_name: string | null;
            user_last_name: string | null;
            user_avatar: string | null;
            user_name: string;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                avatar: string;
            } | undefined;
        };
    }>;
    update(id: string, user_id: string, content: string): Promise<{
        success: boolean;
        data: {
            id: string;
            channel_id: string;
            channelId: string;
            user_id: string;
            userId: string;
            sender_id: string;
            content: string;
            parent_message_id: string;
            attachments: string[];
            mentions: string[];
            reactions: Record<string, string[]>;
            is_edited: boolean;
            is_deleted: boolean;
            created_at: Date;
            createdAt: Date;
            updated_at: Date;
            user_first_name: string | null;
            user_last_name: string | null;
            user_avatar: string | null;
            user_name: string;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                avatar: string;
            } | undefined;
        } | null;
    }>;
    remove(id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addReaction(message_id: string, user_id: string, emoji: string): Promise<{
        success: boolean;
        data: {
            reactions: Record<string, string[]>;
        };
    }>;
    removeReaction(message_id: string, user_id: string, emoji: string): Promise<{
        success: boolean;
        data: {
            reactions: Record<string, string[]>;
        };
    }>;
    getThread(parent_message_id: string, user_id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            channel_id: string;
            channelId: string;
            user_id: string;
            userId: string;
            sender_id: string;
            content: string;
            parent_message_id: string;
            attachments: string[];
            mentions: string[];
            reactions: Record<string, string[]>;
            is_edited: boolean;
            is_deleted: boolean;
            created_at: Date;
            createdAt: Date;
            updated_at: Date;
            user_first_name: string | null;
            user_last_name: string | null;
            user_avatar: string | null;
            user_name: string;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                avatar: string;
            } | undefined;
        }[];
    }>;
    search(channel_id: string, user_id: string, query: string): Promise<{
        success: boolean;
        data: {
            id: string;
            channel_id: string;
            channelId: string;
            user_id: string;
            userId: string;
            sender_id: string;
            content: string;
            parent_message_id: string;
            attachments: string[];
            mentions: string[];
            reactions: Record<string, string[]>;
            is_edited: boolean;
            is_deleted: boolean;
            created_at: Date;
            createdAt: Date;
            updated_at: Date;
            user_first_name: string | null;
            user_last_name: string | null;
            user_avatar: string | null;
            user_name: string;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                avatar: string;
            } | undefined;
        }[];
    }>;
    private getMessageWithUser;
    private notifyMentionedUsers;
}
