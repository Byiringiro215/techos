import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private messagesService;
    constructor(messagesService: MessagesService);
    create(user: any, createMessageDto: CreateMessageDto): Promise<{
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
    findAll(user: any, channelId: string, limit?: number, before?: string): Promise<{
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
    findOne(user: any, id: string): Promise<{
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
    update(user: any, id: string, body: {
        content: string;
    }): Promise<{
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
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addReaction(user: any, id: string, body: {
        emoji: string;
    }): Promise<{
        success: boolean;
        data: {
            reactions: Record<string, string[]>;
        };
    }>;
    removeReaction(user: any, id: string, emoji: string): Promise<{
        success: boolean;
        data: {
            reactions: Record<string, string[]>;
        };
    }>;
    getThread(user: any, id: string): Promise<{
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
    search(user: any, channelId: string, query: string): Promise<{
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
}
