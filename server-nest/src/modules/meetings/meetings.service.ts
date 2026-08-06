import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Meeting } from '../../entities/meeting.entity';
import { MeetingParticipant } from '../../entities/meeting-participant.entity';
import { MeetingActionItem } from '../../entities/meeting-action-item.entity';
import { User } from '../../entities/user.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private meetingsRepository: Repository<Meeting>,
    @InjectRepository(MeetingParticipant)
    private participantsRepository: Repository<MeetingParticipant>,
    @InjectRepository(MeetingActionItem)
    private actionItemsRepository: Repository<MeetingActionItem>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async create(org_id: string, user_id: string, createMeetingDto: CreateMeetingDto) {
    const { participant_ids, ...meetingData } = createMeetingDto;

    // Create meeting
    const meeting = this.meetingsRepository.create({
      id: randomUUID(),
      org_id,
      ...meetingData,
      scheduled_at: `${meetingData.date}T${meetingData.start_time}:00.000Z`,
      organizer_id: user_id,
      status: 'scheduled',
    });

    await this.meetingsRepository.save(meeting);

    // Add organizer as participant
    try {
      await this.addParticipant(meeting.id, user_id, true);
    } catch {
      // Non-fatal: meeting still created
    }

    // Add other participants
    if (participant_ids && participant_ids.length > 0) {
      await Promise.all(
        participant_ids.map((participantId) =>
          this.addParticipant(meeting.id, participantId, false).catch(() => null),
        ),
      );

      // Send email invitations
      try {
        await this.sendMeetingInvites(meeting, participant_ids);
      } catch {
        // Non-fatal
      }
    }

    return {
      success: true,
      data: meeting,
    };
  }

  async findAll(org_id: string, filters?: any) {
    const where: any = { org_id };

    if (filters?.status) {
      where.status = filters.status;
    }

    const meetings = await this.meetingsRepository.find({ where });

    // Get participant counts for each meeting
    const meetingsWithData = await Promise.all(
      meetings.map(async (meeting) => {
        const participantCount = await this.participantsRepository.count({
          where: { meeting_id: meeting.id },
        });

        const actionItemCount = await this.actionItemsRepository.count({
          where: { meeting_id: meeting.id },
        });

        return {
          ...meeting,
          participant_count: participantCount,
          action_item_count: actionItemCount,
        };
      }),
    );

    return {
      success: true,
      data: meetingsWithData,
    };
  }

  async findOne(id: string, org_id: string) {
    const meeting = await this.meetingsRepository.findOne({
      where: { id, org_id },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    // Get participants with user details
    const participants = await this.participantsRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect(User, 'user', 'participant.user_id = user.id')
      .where('participant.meeting_id = :meetingId', { meetingId: id })
      .select([
        'participant.id as id',
        'participant.user_id as user_id',
        'participant.status as status',
        'participant.is_organizer as is_organizer',
        'user.first_name as first_name',
        'user.last_name as last_name',
        'user.email as email',
        'user.avatar as avatar',
      ])
      .getRawMany();

    // Get action items with assignee details
    const actionItems = await this.actionItemsRepository
      .createQueryBuilder('action_item')
      .leftJoinAndSelect(User, 'user', 'action_item.assignee_id = user.id')
      .where('action_item.meeting_id = :meetingId', { meetingId: id })
      .select([
        'action_item.*',
        'user.first_name as assignee_first_name',
        'user.last_name as assignee_last_name',
      ])
      .getRawMany();

    return {
      success: true,
      data: {
        ...meeting,
        participants,
        action_items: actionItems,
      },
    };
  }

  async update(id: string, org_id: string, updateMeetingDto: UpdateMeetingDto) {
    const meeting = await this.meetingsRepository.findOne({
      where: { id, org_id },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    Object.assign(meeting, updateMeetingDto);
    await this.meetingsRepository.save(meeting);

    return {
      success: true,
      data: await this.findOne(id, org_id),
    };
  }

  async remove(id: string, org_id: string) {
    const meeting = await this.meetingsRepository.findOne({
      where: { id, org_id },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    // Delete participants
    await this.participantsRepository.delete({ meeting_id: id });

    // Delete action items
    await this.actionItemsRepository.delete({ meeting_id: id });

    // Delete meeting
    await this.meetingsRepository.remove(meeting);

    return {
      success: true,
      message: 'Meeting deleted successfully',
    };
  }

  // Participant Management
  async addParticipant(meeting_id: string, user_id: string, is_organizer: boolean = false) {
    const participant = this.participantsRepository.create({
      id: randomUUID(),
      meeting_id,
      user_id,
      is_organizer,
      status: 'pending',
    });

    await this.participantsRepository.save(participant);
    return participant;
  }

  async addParticipants(meeting_id: string, org_id: string, participant_ids: string[]) {
    // Verify meeting exists and belongs to org
    const meeting = await this.meetingsRepository.findOne({
      where: { id: meeting_id, org_id },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    // Add participants
    await Promise.all(
      participant_ids.map((userId) => this.addParticipant(meeting_id, userId, false)),
    );

    // Send invites
    await this.sendMeetingInvites(meeting, participant_ids);

    return {
      success: true,
      message: 'Participants added successfully',
    };
  }

  async removeParticipant(meeting_id: string, org_id: string, user_id: string) {
    const meeting = await this.meetingsRepository.findOne({
      where: { id: meeting_id, org_id },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    await this.participantsRepository.delete({ meeting_id, user_id });

    return {
      success: true,
      message: 'Participant removed successfully',
    };
  }

  async updateParticipantStatus(
    meeting_id: string,
    user_id: string,
    status: 'accepted' | 'declined',
  ) {
    const participant = await this.participantsRepository.findOne({
      where: { meeting_id, user_id },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    participant.status = status;
    await this.participantsRepository.save(participant);

    return {
      success: true,
      data: participant,
    };
  }

  // Action Items Management
  async createActionItem(
    meeting_id: string,
    org_id: string,
    createActionItemDto: CreateActionItemDto,
  ) {
    const meeting = await this.meetingsRepository.findOne({
      where: { id: meeting_id, org_id },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    const actionItem = this.actionItemsRepository.create({
      id: randomUUID(),
      meeting_id,
      ...createActionItemDto,
      status: 'pending',
    });

    await this.actionItemsRepository.save(actionItem);

    return {
      success: true,
      data: actionItem,
    };
  }

  async updateActionItem(id: string, meeting_id: string, updateData: Partial<MeetingActionItem>) {
    const actionItem = await this.actionItemsRepository.findOne({
      where: { id, meeting_id },
    });

    if (!actionItem) {
      throw new NotFoundException('Action item not found');
    }

    Object.assign(actionItem, updateData);
    await this.actionItemsRepository.save(actionItem);

    return {
      success: true,
      data: actionItem,
    };
  }

  async updateActionItemById(id: string, org_id: string, updateData: Partial<MeetingActionItem>) {
    const actionItem = await this.actionItemsRepository
      .createQueryBuilder('action_item')
      .leftJoin(Meeting, 'meeting', 'action_item.meeting_id = meeting.id')
      .where('action_item.id = :id', { id })
      .andWhere('meeting.org_id = :org_id', { org_id })
      .select('action_item.*')
      .getRawOne();

    if (!actionItem) {
      throw new NotFoundException('Action item not found');
    }

    await this.actionItemsRepository.update(id, updateData);
    const updated = await this.actionItemsRepository.findOne({ where: { id } });
    return { success: true, data: updated };
  }

  async getActionItems(meeting_id: string, org_id: string) {
    const meeting = await this.meetingsRepository.findOne({
      where: { id: meeting_id, org_id },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    const actionItems = await this.actionItemsRepository.find({
      where: { meeting_id },
      order: { created_at: 'DESC' },
    });

    return { success: true, data: actionItems };
  }

  async deleteActionItem(id: string, meeting_id: string) {
    const actionItem = await this.actionItemsRepository.findOne({
      where: { id, meeting_id },
    });

    if (!actionItem) {
      throw new NotFoundException('Action item not found');
    }

    await this.actionItemsRepository.remove(actionItem);

    return {
      success: true,
      message: 'Action item deleted successfully',
    };
  }

  // Email notifications
  private async sendMeetingInvites(meeting: Meeting, participant_ids: string[]) {
    const participants = await this.usersRepository.find({
      where: participant_ids.map((id) => ({ id })),
    });

    const emails = participants.map((p) => p.email);
    const startDateTime = `${meeting.date} ${meeting.start_time}`;

    await this.emailService.sendMeetingInviteEmail(
      emails,
      meeting.title,
      startDateTime,
      meeting.meeting_link,
    );
  }
}
