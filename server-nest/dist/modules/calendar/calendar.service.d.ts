import { Repository } from 'typeorm';
import { CalendarEvent } from '../../entities/calendar-event.entity';
import { Meeting } from '../../entities/meeting.entity';
import { MeetingParticipant } from '../../entities/meeting-participant.entity';
import { CreateEventDto } from './dto/create-event.dto';
export declare class CalendarService {
    private eventsRepository;
    private meetingsRepository;
    private participantsRepository;
    constructor(eventsRepository: Repository<CalendarEvent>, meetingsRepository: Repository<Meeting>, participantsRepository: Repository<MeetingParticipant>);
    private normalizeAttendees;
    private assertOwns;
    create(org_id: string, user_id: string, createEventDto: CreateEventDto): Promise<{
        success: boolean;
        data: {
            source: string;
            can_edit: boolean;
            id: string;
            org_id: string;
            title: string;
            description: string;
            start_datetime: string;
            end_datetime: string;
            all_day: boolean;
            type: string;
            color: string;
            recurrence: any;
            created_by: string;
            attendees: string[];
            created_at: Date;
        };
    }>;
    findAll(org_id: string, user_id: string, start_date?: string, end_date?: string, type?: string): Promise<{
        success: boolean;
        data: (Record<string, any> | {
            source: "personal";
            can_edit: boolean;
            id: string;
            org_id: string;
            title: string;
            description: string;
            start_datetime: string;
            end_datetime: string;
            all_day: boolean;
            type: string;
            color: string;
            recurrence: any;
            created_by: string;
            attendees: string[];
            created_at: Date;
        })[];
    }>;
    private getMeetingEventsForUser;
    findOne(id: string, org_id: string, user_id: string): Promise<{
        success: boolean;
        data: {
            source: string;
            can_edit: boolean;
            id: string;
            org_id: string;
            title: string;
            description: string;
            start_datetime: string;
            end_datetime: string;
            all_day: boolean;
            type: string;
            color: string;
            recurrence: any;
            created_by: string;
            attendees: string[];
            created_at: Date;
        };
    }>;
    update(id: string, org_id: string, user_id: string, updateData: Partial<CalendarEvent>): Promise<{
        success: boolean;
        data: {
            source: string;
            can_edit: boolean;
            id: string;
            org_id: string;
            title: string;
            description: string;
            start_datetime: string;
            end_datetime: string;
            all_day: boolean;
            type: string;
            color: string;
            recurrence: any;
            created_by: string;
            attendees: string[];
            created_at: Date;
        };
    }>;
    remove(id: string, org_id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserEvents(org_id: string, user_id: string, start_date?: string, end_date?: string): Promise<{
        success: boolean;
        data: (Record<string, any> | {
            source: "personal";
            can_edit: boolean;
            id: string;
            org_id: string;
            title: string;
            description: string;
            start_datetime: string;
            end_datetime: string;
            all_day: boolean;
            type: string;
            color: string;
            recurrence: any;
            created_by: string;
            attendees: string[];
            created_at: Date;
        })[];
    }>;
}
