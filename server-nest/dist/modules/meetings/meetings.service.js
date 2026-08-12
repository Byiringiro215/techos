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
exports.MeetingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const meeting_entity_1 = require("../../entities/meeting.entity");
const meeting_participant_entity_1 = require("../../entities/meeting-participant.entity");
const meeting_action_item_entity_1 = require("../../entities/meeting-action-item.entity");
const user_entity_1 = require("../../entities/user.entity");
const email_service_1 = require("../../common/services/email.service");
const org_admin_1 = require("../../common/utils/org-admin");
const notifications_service_1 = require("../notifications/notifications.service");
let MeetingsService = class MeetingsService {
    meetingsRepository;
    participantsRepository;
    actionItemsRepository;
    usersRepository;
    emailService;
    notificationsService;
    constructor(meetingsRepository, participantsRepository, actionItemsRepository, usersRepository, emailService, notificationsService) {
        this.meetingsRepository = meetingsRepository;
        this.participantsRepository = participantsRepository;
        this.actionItemsRepository = actionItemsRepository;
        this.usersRepository = usersRepository;
        this.emailService = emailService;
        this.notificationsService = notificationsService;
    }
    userLabel(user) {
        if (!user)
            return null;
        return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || null;
    }
    async assertCanAccessMeeting(meeting_id, org_id, user) {
        if ((0, org_admin_1.isOrgAdmin)(user?.role))
            return;
        const membership = await this.participantsRepository.findOne({
            where: { meeting_id, user_id: user?.id },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You are not invited to this meeting');
        }
    }
    async create(org_id, actor, createMeetingDto) {
        (0, org_admin_1.assertOrgAdmin)(actor, 'create meetings');
        const { participant_ids, ...meetingData } = createMeetingDto;
        const viewers = [
            ...new Set((participant_ids || []).filter((id) => typeof id === 'string' && !!id.trim() && id !== actor.id)),
        ];
        if (!viewers.length) {
            throw new common_1.BadRequestException('Select at least one viewer for this meeting');
        }
        const meeting = this.meetingsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...meetingData,
            scheduled_at: `${meetingData.date}T${meetingData.start_time}:00.000Z`,
            organizer_id: actor.id,
            status: 'scheduled',
        });
        await this.meetingsRepository.save(meeting);
        try {
            await this.addParticipant(meeting.id, actor.id, true);
        }
        catch {
        }
        await Promise.all(viewers.map((participantId) => this.addParticipant(meeting.id, participantId, false).catch(() => null)));
        try {
            await this.sendMeetingInvites(meeting, viewers);
        }
        catch {
        }
        const actorUser = await this.usersRepository.findOne({ where: { id: actor.id } }).catch(() => null);
        const actorName = actorUser
            ? `${actorUser.first_name || ''} ${actorUser.last_name || ''}`.trim() || actorUser.email
            : 'Someone';
        const meetingTime = meeting.scheduled_at
            ? new Date(meeting.scheduled_at).toLocaleString()
            : `${meetingData.date} ${meetingData.start_time}`;
        await Promise.all(viewers.map((uid) => this.notificationsService.create(org_id, {
            user_id: uid,
            type: 'meeting_invite',
            title: 'Meeting Invitation',
            message: `${actorName} invited you to "${meeting.title || 'a meeting'}" on ${meetingTime}`,
            link: `/meetings`,
            metadata: { meeting_id: meeting.id },
        }).catch(() => null)));
        return {
            success: true,
            data: meeting,
        };
    }
    async findAll(org_id, user, filters) {
        const where = { org_id };
        if (filters?.status) {
            where.status = filters.status;
        }
        let meetings = await this.meetingsRepository.find({ where });
        if (!(0, org_admin_1.isOrgAdmin)(user?.role) && user?.id) {
            const memberships = await this.participantsRepository.find({
                where: { user_id: user.id },
            });
            const allowed = new Set(memberships.map((m) => m.meeting_id));
            meetings = meetings.filter((m) => allowed.has(m.id) || m.organizer_id === user.id);
        }
        const meetingsWithData = await Promise.all(meetings.map(async (meeting) => {
            const participantCount = await this.participantsRepository.count({
                where: { meeting_id: meeting.id },
            });
            const actionItemCount = await this.actionItemsRepository.count({
                where: { meeting_id: meeting.id },
            });
            const participantRows = await this.participantsRepository.find({
                where: { meeting_id: meeting.id },
            });
            return {
                ...meeting,
                participant_count: participantCount,
                action_item_count: actionItemCount,
                participant_ids: participantRows.map((p) => p.user_id),
            };
        }));
        return {
            success: true,
            data: meetingsWithData,
        };
    }
    async findOne(id, org_id, user) {
        const meeting = await this.meetingsRepository.findOne({
            where: { id, org_id },
        });
        if (!meeting) {
            throw new common_1.NotFoundException('Meeting not found');
        }
        await this.assertCanAccessMeeting(id, org_id, user);
        const [participantRows, actionItemRows] = await Promise.all([
            this.participantsRepository.find({ where: { meeting_id: id } }),
            this.actionItemsRepository.find({ where: { meeting_id: id } }),
        ]);
        const userIds = [
            ...new Set([
                ...participantRows.map((p) => p.user_id),
                ...actionItemRows.map((a) => a.assignee_id),
                meeting.organizer_id,
            ].filter(Boolean)),
        ];
        const users = userIds.length
            ? await this.usersRepository.find({ where: { id: (0, typeorm_2.In)(userIds) } })
            : [];
        const userMap = new Map(users.map((u) => [u.id, u]));
        const participants = participantRows.map((p) => {
            const u = userMap.get(p.user_id);
            return {
                id: p.id,
                user_id: p.user_id,
                status: p.status,
                is_organizer: p.is_organizer,
                first_name: u?.first_name || null,
                last_name: u?.last_name || null,
                email: u?.email || null,
                avatar: u?.avatar || null,
                name: this.userLabel(u),
            };
        });
        const action_items = actionItemRows.map((item) => {
            const u = userMap.get(item.assignee_id);
            return {
                ...item,
                assignee_first_name: u?.first_name || null,
                assignee_last_name: u?.last_name || null,
                assignee_name: this.userLabel(u),
            };
        });
        const organizer = userMap.get(meeting.organizer_id);
        return {
            success: true,
            data: {
                ...meeting,
                organizer_name: this.userLabel(organizer),
                owner: this.userLabel(organizer) || meeting.organizer_id,
                participants,
                participant_ids: participantRows.map((p) => p.user_id),
                action_items,
            },
        };
    }
    async update(id, org_id, updateMeetingDto, user) {
        (0, org_admin_1.assertOrgAdmin)(user, 'update meetings');
        const meeting = await this.meetingsRepository.findOne({
            where: { id, org_id },
        });
        if (!meeting) {
            throw new common_1.NotFoundException('Meeting not found');
        }
        Object.assign(meeting, updateMeetingDto);
        await this.meetingsRepository.save(meeting);
        return {
            success: true,
            data: (await this.findOne(id, org_id, user)).data,
        };
    }
    async remove(id, org_id, user) {
        (0, org_admin_1.assertOrgAdmin)(user, 'delete meetings');
        const meeting = await this.meetingsRepository.findOne({
            where: { id, org_id },
        });
        if (!meeting) {
            throw new common_1.NotFoundException('Meeting not found');
        }
        await this.participantsRepository.delete({ meeting_id: id });
        await this.actionItemsRepository.delete({ meeting_id: id });
        await this.meetingsRepository.remove(meeting);
        return {
            success: true,
            message: 'Meeting deleted successfully',
        };
    }
    async addParticipant(meeting_id, user_id, is_organizer = false) {
        const participant = this.participantsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            meeting_id,
            user_id,
            is_organizer,
            status: 'pending',
        });
        await this.participantsRepository.save(participant);
        return participant;
    }
    async addParticipants(meeting_id, org_id, participant_ids) {
        const meeting = await this.meetingsRepository.findOne({
            where: { id: meeting_id, org_id },
        });
        if (!meeting) {
            throw new common_1.NotFoundException('Meeting not found');
        }
        await Promise.all(participant_ids.map((userId) => this.addParticipant(meeting_id, userId, false)));
        await this.sendMeetingInvites(meeting, participant_ids);
        return {
            success: true,
            message: 'Participants added successfully',
        };
    }
    async removeParticipant(meeting_id, org_id, user_id) {
        const meeting = await this.meetingsRepository.findOne({
            where: { id: meeting_id, org_id },
        });
        if (!meeting) {
            throw new common_1.NotFoundException('Meeting not found');
        }
        await this.participantsRepository.delete({ meeting_id, user_id });
        return {
            success: true,
            message: 'Participant removed successfully',
        };
    }
    async updateParticipantStatus(meeting_id, user_id, status) {
        const participant = await this.participantsRepository.findOne({
            where: { meeting_id, user_id },
        });
        if (!participant) {
            throw new common_1.NotFoundException('Participant not found');
        }
        participant.status = status;
        await this.participantsRepository.save(participant);
        return {
            success: true,
            data: participant,
        };
    }
    async createActionItem(meeting_id, org_id, createActionItemDto) {
        const meeting = await this.meetingsRepository.findOne({
            where: { id: meeting_id, org_id },
        });
        if (!meeting) {
            throw new common_1.NotFoundException('Meeting not found');
        }
        const actionItem = this.actionItemsRepository.create({
            id: (0, crypto_1.randomUUID)(),
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
    async updateActionItem(id, meeting_id, updateData) {
        const actionItem = await this.actionItemsRepository.findOne({
            where: { id, meeting_id },
        });
        if (!actionItem) {
            throw new common_1.NotFoundException('Action item not found');
        }
        Object.assign(actionItem, updateData);
        await this.actionItemsRepository.save(actionItem);
        return {
            success: true,
            data: actionItem,
        };
    }
    async updateActionItemById(id, org_id, updateData) {
        const actionItem = await this.actionItemsRepository.findOne({ where: { id } });
        if (!actionItem) {
            throw new common_1.NotFoundException('Action item not found');
        }
        const meeting = await this.meetingsRepository.findOne({
            where: { id: actionItem.meeting_id, org_id },
        });
        if (!meeting) {
            throw new common_1.NotFoundException('Action item not found');
        }
        await this.actionItemsRepository.update(id, updateData);
        const updated = await this.actionItemsRepository.findOne({ where: { id } });
        return { success: true, data: updated };
    }
    async getActionItems(meeting_id, org_id) {
        const meeting = await this.meetingsRepository.findOne({
            where: { id: meeting_id, org_id },
        });
        if (!meeting) {
            throw new common_1.NotFoundException('Meeting not found');
        }
        const actionItems = await this.actionItemsRepository.find({
            where: { meeting_id },
            order: { created_at: 'DESC' },
        });
        return { success: true, data: actionItems };
    }
    async deleteActionItem(id, meeting_id) {
        const actionItem = await this.actionItemsRepository.findOne({
            where: { id, meeting_id },
        });
        if (!actionItem) {
            throw new common_1.NotFoundException('Action item not found');
        }
        await this.actionItemsRepository.remove(actionItem);
        return {
            success: true,
            message: 'Action item deleted successfully',
        };
    }
    async sendMeetingInvites(meeting, participant_ids) {
        const participants = await this.usersRepository.find({
            where: participant_ids.map((id) => ({ id })),
        });
        const emails = participants.map((p) => p.email);
        const startDateTime = `${meeting.date} ${meeting.start_time}`;
        await this.emailService.sendMeetingInviteEmail(emails, meeting.title, startDateTime, meeting.meeting_link);
    }
};
exports.MeetingsService = MeetingsService;
exports.MeetingsService = MeetingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(meeting_entity_1.Meeting)),
    __param(1, (0, typeorm_1.InjectRepository)(meeting_participant_entity_1.MeetingParticipant)),
    __param(2, (0, typeorm_1.InjectRepository)(meeting_action_item_entity_1.MeetingActionItem)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        notifications_service_1.NotificationsService])
], MeetingsService);
//# sourceMappingURL=meetings.service.js.map