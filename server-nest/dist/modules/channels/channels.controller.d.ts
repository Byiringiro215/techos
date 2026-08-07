import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { MessagesService } from '../messages/messages.service';
export declare class ChannelsController {
    private channelsService;
    private messagesService;
    constructor(channelsService: ChannelsService, messagesService: MessagesService);
    create(user: any, createChannelDto: CreateChannelDto): Promise<{
        success: boolean;
        data: {
            success: boolean;
            data: {
                members: {
                    id: string;
                    user_id: string;
                    role: string;
                    joined_at: any;
                    first_name: string | null;
                    last_name: string | null;
                    email: string | null;
                    avatar: string | null;
                }[];
                user_role: string | undefined;
                id: string;
                org_id: string;
                name: string;
                description: string;
                type: string;
                created_by: string;
                is_archived: boolean;
                created_at: Date;
            };
        };
    }>;
    openDirect(user: any, body: {
        user_id: string;
    }): Promise<{
        success: boolean;
        data: {
            success: boolean;
            data: {
                members: {
                    id: string;
                    user_id: string;
                    role: string;
                    joined_at: any;
                    first_name: string | null;
                    last_name: string | null;
                    email: string | null;
                    avatar: string | null;
                }[];
                user_role: string | undefined;
                id: string;
                org_id: string;
                name: string;
                description: string;
                type: string;
                created_by: string;
                is_archived: boolean;
                created_at: Date;
            };
        };
    }>;
    findAll(user: any): Promise<{
        success: boolean;
        data: {
            member_count: number;
            last_read_at: Date | undefined;
            user_role: string | undefined;
            id: string;
            org_id: string;
            name: string;
            description: string;
            type: string;
            created_by: string;
            is_archived: boolean;
            created_at: Date;
        }[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: {
            members: {
                id: string;
                user_id: string;
                role: string;
                joined_at: any;
                first_name: string | null;
                last_name: string | null;
                email: string | null;
                avatar: string | null;
            }[];
            user_role: string | undefined;
            id: string;
            org_id: string;
            name: string;
            description: string;
            type: string;
            created_by: string;
            is_archived: boolean;
            created_at: Date;
        };
    }>;
    update(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").Channel;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addMembers(user: any, id: string, body: {
        member_ids: string[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    removeMember(user: any, id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsRead(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getChannelMessages(user: any, id: string, limit?: number, before?: string): Promise<{
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
    postChannelMessage(user: any, id: string, body: {
        content: string;
        parent_message_id?: string;
        mentions?: string[];
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
}
