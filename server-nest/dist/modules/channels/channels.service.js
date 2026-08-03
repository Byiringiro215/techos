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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const channel_entity_1 = require("../../entities/channel.entity");
const channel_member_entity_1 = require("../../entities/channel-member.entity");
const user_entity_1 = require("../../entities/user.entity");
let ChannelsService = class ChannelsService {
    channelsRepository;
    membersRepository;
    usersRepository;
    constructor(channelsRepository, membersRepository, usersRepository) {
        this.channelsRepository = channelsRepository;
        this.membersRepository = membersRepository;
        this.usersRepository = usersRepository;
    }
    async create(org_id, user_id, createChannelDto) {
        const { member_ids, ...channelData } = createChannelDto;
        const channel = this.channelsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...channelData,
            created_by: user_id,
            type: channelData.type || 'public',
        });
        await this.channelsRepository.save(channel);
        await this.addMember(channel.id, user_id, 'admin');
        if (member_ids && member_ids.length > 0) {
            await Promise.all(member_ids.map((memberId) => this.addMember(channel.id, memberId, 'member')));
        }
        return {
            success: true,
            data: await this.findOne(channel.id, org_id, user_id),
        };
    }
    async findAll(org_id, user_id) {
        const memberChannels = await this.membersRepository.find({
            where: { user_id },
        });
        const channelIds = memberChannels.map((m) => m.channel_id);
        if (channelIds.length === 0) {
            return { success: true, data: [] };
        }
        const channels = await this.channelsRepository
            .createQueryBuilder('channel')
            .where('channel.org_id = :org_id', { org_id })
            .andWhere('channel.id IN (:...channelIds)', { channelIds })
            .getMany();
        const channelsWithData = await Promise.all(channels.map(async (channel) => {
            const memberCount = await this.membersRepository.count({
                where: { channel_id: channel.id },
            });
            const memberData = await this.membersRepository.findOne({
                where: { channel_id: channel.id, user_id },
            });
            return {
                ...channel,
                member_count: memberCount,
                last_read_at: memberData?.last_read_at,
                user_role: memberData?.role,
            };
        }));
        return {
            success: true,
            data: channelsWithData,
        };
    }
    async findOne(id, org_id, user_id) {
        const channel = await this.channelsRepository.findOne({
            where: { id, org_id },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        const membership = await this.membersRepository.findOne({
            where: { channel_id: id, user_id },
        });
        if (!membership && channel.type === 'private') {
            throw new common_1.ForbiddenException('You do not have access to this channel');
        }
        const members = await this.membersRepository
            .createQueryBuilder('member')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'member.user_id = user.id')
            .where('member.channel_id = :channelId', { channelId: id })
            .select([
            'member.id as id',
            'member.user_id as user_id',
            'member.role as role',
            'member.joined_at as joined_at',
            'user.first_name as first_name',
            'user.last_name as last_name',
            'user.email as email',
            'user.avatar as avatar',
        ])
            .getRawMany();
        return {
            success: true,
            data: {
                ...channel,
                members,
                user_role: membership?.role,
            },
        };
    }
    async update(id, org_id, user_id, updateData) {
        const channel = await this.channelsRepository.findOne({
            where: { id, org_id },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        const membership = await this.membersRepository.findOne({
            where: { channel_id: id, user_id },
        });
        if (!membership || membership.role !== 'admin') {
            throw new common_1.ForbiddenException('Only channel admins can update channel');
        }
        Object.assign(channel, updateData);
        await this.channelsRepository.save(channel);
        return {
            success: true,
            data: channel,
        };
    }
    async remove(id, org_id, user_id) {
        const channel = await this.channelsRepository.findOne({
            where: { id, org_id },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        const membership = await this.membersRepository.findOne({
            where: { channel_id: id, user_id },
        });
        if (!membership || membership.role !== 'admin') {
            throw new common_1.ForbiddenException('Only channel admins can delete channel');
        }
        await this.membersRepository.delete({ channel_id: id });
        await this.channelsRepository.remove(channel);
        return {
            success: true,
            message: 'Channel deleted successfully',
        };
    }
    async addMember(channel_id, user_id, role = 'member') {
        const member = this.membersRepository.create({
            id: (0, crypto_1.randomUUID)(),
            channel_id,
            user_id,
            role,
        });
        await this.membersRepository.save(member);
        return member;
    }
    async addMembers(channel_id, org_id, user_id, member_ids) {
        const channel = await this.channelsRepository.findOne({
            where: { id: channel_id, org_id },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        const membership = await this.membersRepository.findOne({
            where: { channel_id, user_id },
        });
        if (!membership || membership.role !== 'admin') {
            throw new common_1.ForbiddenException('Only channel admins can add members');
        }
        await Promise.all(member_ids.map((memberId) => this.addMember(channel_id, memberId, 'member')));
        return {
            success: true,
            message: 'Members added successfully',
        };
    }
    async removeMember(channel_id, org_id, requesting_user_id, user_id) {
        const channel = await this.channelsRepository.findOne({
            where: { id: channel_id, org_id },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        const membership = await this.membersRepository.findOne({
            where: { channel_id, user_id: requesting_user_id },
        });
        if (requesting_user_id !== user_id && (!membership || membership.role !== 'admin')) {
            throw new common_1.ForbiddenException('Only channel admins can remove members');
        }
        await this.membersRepository.delete({ channel_id, user_id });
        return {
            success: true,
            message: 'Member removed successfully',
        };
    }
    async updateLastRead(channel_id, user_id) {
        const member = await this.membersRepository.findOne({
            where: { channel_id, user_id },
        });
        if (member) {
            member.last_read_at = new Date();
            await this.membersRepository.save(member);
        }
        return {
            success: true,
            message: 'Last read updated',
        };
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __param(1, (0, typeorm_1.InjectRepository)(channel_member_entity_1.ChannelMember)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChannelsService);
//# sourceMappingURL=channels.service.js.map