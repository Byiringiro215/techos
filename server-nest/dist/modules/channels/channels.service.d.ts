import { Repository } from 'typeorm';
import { Channel } from '../../entities/channel.entity';
import { ChannelMember } from '../../entities/channel-member.entity';
import { User } from '../../entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
export declare class ChannelsService {
    private channelsRepository;
    private membersRepository;
    private usersRepository;
    constructor(channelsRepository: Repository<Channel>, membersRepository: Repository<ChannelMember>, usersRepository: Repository<User>);
    private ensureDefaultChannel;
    findOrCreateDirect(org_id: string, user_id: string, other_user_id: string): Promise<{
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
    create(org_id: string, user_id: string, createChannelDto: CreateChannelDto): Promise<{
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
    findAll(org_id: string, user_id: string): Promise<{
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
    findOne(id: string, org_id: string, user_id: string): Promise<{
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
    update(id: string, org_id: string, user_id: string, updateData: Partial<Channel>): Promise<{
        success: boolean;
        data: Channel;
    }>;
    remove(id: string, org_id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private addMember;
    addMembers(channel_id: string, org_id: string, user_id: string, member_ids: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
    removeMember(channel_id: string, org_id: string, requesting_user_id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateLastRead(channel_id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
