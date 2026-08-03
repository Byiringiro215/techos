import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Channel } from '../../entities/channel.entity';
import { ChannelMember } from '../../entities/channel-member.entity';
import { User } from '../../entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private membersRepository: Repository<ChannelMember>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(org_id: string, user_id: string, createChannelDto: CreateChannelDto) {
    const { member_ids, ...channelData } = createChannelDto;

    // Create channel
    const channel = this.channelsRepository.create({
      id: randomUUID(),
      org_id,
      ...channelData,
      created_by: user_id,
      type: channelData.type || 'public',
    });

    await this.channelsRepository.save(channel);

    // Add creator as admin
    await this.addMember(channel.id, user_id, 'admin');

    // Add other members
    if (member_ids && member_ids.length > 0) {
      await Promise.all(
        member_ids.map((memberId) => this.addMember(channel.id, memberId, 'member')),
      );
    }

    return {
      success: true,
      data: await this.findOne(channel.id, org_id, user_id),
    };
  }

  async findAll(org_id: string, user_id: string) {
    // Get all channels user has access to
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

    // Get member counts and unread counts
    const channelsWithData = await Promise.all(
      channels.map(async (channel) => {
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
      }),
    );

    return {
      success: true,
      data: channelsWithData,
    };
  }

  async findOne(id: string, org_id: string, user_id: string) {
    const channel = await this.channelsRepository.findOne({
      where: { id, org_id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    // Check if user is a member
    const membership = await this.membersRepository.findOne({
      where: { channel_id: id, user_id },
    });

    if (!membership && channel.type === 'private') {
      throw new ForbiddenException('You do not have access to this channel');
    }

    // Get members with user details
    const members = await this.membersRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect(User, 'user', 'member.user_id = user.id')
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

  async update(id: string, org_id: string, user_id: string, updateData: Partial<Channel>) {
    const channel = await this.channelsRepository.findOne({
      where: { id, org_id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    // Check if user is admin
    const membership = await this.membersRepository.findOne({
      where: { channel_id: id, user_id },
    });

    if (!membership || membership.role !== 'admin') {
      throw new ForbiddenException('Only channel admins can update channel');
    }

    Object.assign(channel, updateData);
    await this.channelsRepository.save(channel);

    return {
      success: true,
      data: channel,
    };
  }

  async remove(id: string, org_id: string, user_id: string) {
    const channel = await this.channelsRepository.findOne({
      where: { id, org_id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    // Check if user is admin
    const membership = await this.membersRepository.findOne({
      where: { channel_id: id, user_id },
    });

    if (!membership || membership.role !== 'admin') {
      throw new ForbiddenException('Only channel admins can delete channel');
    }

    // Delete members
    await this.membersRepository.delete({ channel_id: id });

    // Delete channel
    await this.channelsRepository.remove(channel);

    return {
      success: true,
      message: 'Channel deleted successfully',
    };
  }

  // Member Management
  private async addMember(channel_id: string, user_id: string, role: string = 'member') {
    const member = this.membersRepository.create({
      id: randomUUID(),
      channel_id,
      user_id,
      role,
    });

    await this.membersRepository.save(member);
    return member;
  }

  async addMembers(channel_id: string, org_id: string, user_id: string, member_ids: string[]) {
    const channel = await this.channelsRepository.findOne({
      where: { id: channel_id, org_id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    // Check if user is admin
    const membership = await this.membersRepository.findOne({
      where: { channel_id, user_id },
    });

    if (!membership || membership.role !== 'admin') {
      throw new ForbiddenException('Only channel admins can add members');
    }

    // Add members
    await Promise.all(
      member_ids.map((memberId) => this.addMember(channel_id, memberId, 'member')),
    );

    return {
      success: true,
      message: 'Members added successfully',
    };
  }

  async removeMember(channel_id: string, org_id: string, requesting_user_id: string, user_id: string) {
    const channel = await this.channelsRepository.findOne({
      where: { id: channel_id, org_id },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    // Check if requesting user is admin or removing themselves
    const membership = await this.membersRepository.findOne({
      where: { channel_id, user_id: requesting_user_id },
    });

    if (requesting_user_id !== user_id && (!membership || membership.role !== 'admin')) {
      throw new ForbiddenException('Only channel admins can remove members');
    }

    await this.membersRepository.delete({ channel_id, user_id });

    return {
      success: true,
      message: 'Member removed successfully',
    };
  }

  async updateLastRead(channel_id: string, user_id: string) {
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
}
