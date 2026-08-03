import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
export declare class ChannelsController {
    private channelsService;
    constructor(channelsService: ChannelsService);
    create(user: any, createChannelDto: CreateChannelDto): Promise<{
        success: boolean;
        data: {
            success: boolean;
            data: {
                members: any[];
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
            members: any[];
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
}
