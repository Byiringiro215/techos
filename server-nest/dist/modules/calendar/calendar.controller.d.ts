import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
export declare class CalendarController {
    private calendarService;
    constructor(calendarService: CalendarService);
    create(user: any, createEventDto: CreateEventDto): Promise<{
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
    findAll(user: any, start_date?: string, end_date?: string, type?: string): Promise<{
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
    getUserEvents(user: any, start_date?: string, end_date?: string): Promise<{
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
    findOne(user: any, id: string): Promise<{
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
    update(user: any, id: string, updateData: any): Promise<{
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
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
