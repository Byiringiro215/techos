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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const calendar_event_entity_1 = require("../../entities/calendar-event.entity");
const meeting_entity_1 = require("../../entities/meeting.entity");
const meeting_participant_entity_1 = require("../../entities/meeting-participant.entity");
let CalendarService = class CalendarService {
    eventsRepository;
    meetingsRepository;
    participantsRepository;
    constructor(eventsRepository, meetingsRepository, participantsRepository) {
        this.eventsRepository = eventsRepository;
        this.meetingsRepository = meetingsRepository;
        this.participantsRepository = participantsRepository;
    }
    normalizeAttendees(attendees, ownerId) {
        const raw = Array.isArray(attendees)
            ? attendees.filter((id) => typeof id === 'string' && !!id.trim())
            : [];
        return [...new Set([ownerId, ...raw])];
    }
    assertOwns(event, user_id) {
        if (event.created_by !== user_id) {
            throw new common_1.ForbiddenException('You can only manage your own calendar events');
        }
    }
    async create(org_id, user_id, createEventDto) {
        const event = this.eventsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            title: createEventDto.title,
            description: createEventDto.description,
            start_datetime: createEventDto.start_datetime,
            end_datetime: createEventDto.end_datetime,
            created_by: user_id,
            all_day: createEventDto.all_day || false,
            type: createEventDto.type || 'event',
            color: createEventDto.color,
            recurrence: createEventDto.recurrence,
            attendees: this.normalizeAttendees(createEventDto.attendees, user_id),
        });
        await this.eventsRepository.save(event);
        return {
            success: true,
            data: { ...event, source: 'personal', can_edit: true },
        };
    }
    async findAll(org_id, user_id, start_date, end_date, type) {
        const queryBuilder = this.eventsRepository
            .createQueryBuilder('event')
            .where('event.org_id = :org_id', { org_id })
            .andWhere('(event.created_by = :user_id OR CAST(event.attendees AS text) LIKE :user_like)', {
            user_id,
            user_like: `%${user_id}%`,
        });
        if (start_date && end_date) {
            queryBuilder.andWhere('event.start_datetime BETWEEN :start AND :end', {
                start: start_date,
                end: end_date,
            });
        }
        if (type) {
            queryBuilder.andWhere('event.type = :type', { type });
        }
        const personal = await queryBuilder.orderBy('event.start_datetime', 'ASC').getMany();
        const personalMapped = personal.map((event) => ({
            ...event,
            source: 'personal',
            can_edit: event.created_by === user_id,
        }));
        const meetingEvents = (type && type !== 'meeting'
            ? []
            : await this.getMeetingEventsForUser(org_id, user_id, start_date, end_date));
        const merged = [...personalMapped, ...meetingEvents].sort((a, b) => String(a.start_datetime || '').localeCompare(String(b.start_datetime || '')));
        return {
            success: true,
            data: merged,
        };
    }
    async getMeetingEventsForUser(org_id, user_id, start_date, end_date) {
        const memberships = await this.participantsRepository.find({ where: { user_id } });
        const memberMeetingIds = memberships.map((m) => m.meeting_id);
        const meetings = await this.meetingsRepository.find({ where: { org_id } });
        const visible = meetings.filter((m) => m.organizer_id === user_id || memberMeetingIds.includes(m.id));
        return visible
            .map((m) => {
            const start = m.scheduled_at ||
                (m.date && m.start_time ? `${m.date}T${m.start_time}:00.000Z` : null);
            const end = m.date && m.end_time
                ? `${m.date}T${m.end_time}:00.000Z`
                : start;
            if (!start)
                return null;
            if (start_date && end_date) {
                const t = new Date(start).getTime();
                const from = new Date(start_date).getTime();
                const to = new Date(end_date).getTime();
                if (Number.isFinite(t) && (t < from || t > to))
                    return null;
            }
            return {
                id: `meeting:${m.id}`,
                org_id: m.org_id,
                title: m.title,
                description: m.agenda || m.description || null,
                start_datetime: start,
                end_datetime: end,
                all_day: false,
                type: 'meeting',
                color: null,
                recurrence: null,
                created_by: m.organizer_id,
                attendees: [],
                created_at: m.created_at,
                location: m.location || m.meeting_link || null,
                source: 'meeting',
                can_edit: false,
                meeting_id: m.id,
            };
        })
            .filter((row) => row != null);
    }
    async findOne(id, org_id, user_id) {
        if (id.startsWith('meeting:')) {
            throw new common_1.NotFoundException('Use the Meetings page for meeting details');
        }
        const event = await this.eventsRepository.findOne({
            where: { id, org_id },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isOwner = event.created_by === user_id;
        const isAttendee = Array.isArray(event.attendees) && event.attendees.includes(user_id);
        if (!isOwner && !isAttendee) {
            throw new common_1.ForbiddenException('You do not have access to this event');
        }
        return {
            success: true,
            data: { ...event, source: 'personal', can_edit: isOwner },
        };
    }
    async update(id, org_id, user_id, updateData) {
        if (id.startsWith('meeting:')) {
            throw new common_1.ForbiddenException('Invited meetings cannot be edited from your calendar');
        }
        const event = await this.eventsRepository.findOne({
            where: { id, org_id },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        this.assertOwns(event, user_id);
        const { id: _id, org_id: _org, created_by: _by, created_at: _at, ...safe } = updateData;
        if (safe.attendees !== undefined) {
            safe.attendees = this.normalizeAttendees(safe.attendees, user_id);
        }
        Object.assign(event, safe);
        await this.eventsRepository.save(event);
        return {
            success: true,
            data: { ...event, source: 'personal', can_edit: true },
        };
    }
    async remove(id, org_id, user_id) {
        if (id.startsWith('meeting:')) {
            throw new common_1.ForbiddenException('Invited meetings cannot be deleted from your calendar');
        }
        const event = await this.eventsRepository.findOne({
            where: { id, org_id },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        this.assertOwns(event, user_id);
        await this.eventsRepository.remove(event);
        return {
            success: true,
            message: 'Event deleted successfully',
        };
    }
    async getUserEvents(org_id, user_id, start_date, end_date) {
        return this.findAll(org_id, user_id, start_date, end_date);
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calendar_event_entity_1.CalendarEvent)),
    __param(1, (0, typeorm_1.InjectRepository)(meeting_entity_1.Meeting)),
    __param(2, (0, typeorm_1.InjectRepository)(meeting_participant_entity_1.MeetingParticipant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map