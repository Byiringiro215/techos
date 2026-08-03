import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
export declare class CalendarController {
    private calendarService;
    constructor(calendarService: CalendarService);
    create(user: any, createEventDto: CreateEventDto): Promise<{
        success: boolean;
        data: import("../../entities").CalendarEvent;
    }>;
    findAll(user: any, start_date?: string, end_date?: string, type?: string): Promise<{
        success: boolean;
        data: import("../../entities").CalendarEvent[];
    }>;
    getUserEvents(user: any, start_date?: string, end_date?: string): Promise<{
        success: boolean;
        data: import("../../entities").CalendarEvent[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").CalendarEvent;
    }>;
    update(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").CalendarEvent;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
