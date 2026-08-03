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
    create(user_id: string, createMessageDto: CreateMessageDto): Promise<{
        success: boolean;
        data: any;
    }>;
    findAll(channel_id: string, user_id: string, limit?: number, before?: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(id: string, user_id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: string, user_id: string, content: string): Promise<{
        success: boolean;
        data: any;
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
        data: any[];
    }>;
    search(channel_id: string, user_id: string, query: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    private getMessageWithUser;
    private notifyMentionedUsers;
}
