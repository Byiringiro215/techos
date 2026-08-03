import { Repository } from 'typeorm';
import { CalendarEvent } from '../../entities/calendar-event.entity';
import { User } from '../../entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
export declare class CalendarService {
    private eventsRepository;
    private usersRepository;
    constructor(eventsRepository: Repository<CalendarEvent>, usersRepository: Repository<User>);
    create(org_id: string, user_id: string, createEventDto: CreateEventDto): Promise<{
        success: boolean;
        data: CalendarEvent;
    }>;
    findAll(org_id: string, start_date?: string, end_date?: string, type?: string): Promise<{
        success: boolean;
        data: CalendarEvent[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: CalendarEvent;
    }>;
    update(id: string, org_id: string, updateData: Partial<CalendarEvent>): Promise<{
        success: boolean;
        data: CalendarEvent;
    }>;
    remove(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserEvents(org_id: string, user_id: string, start_date?: string, end_date?: string): Promise<{
        success: boolean;
        data: CalendarEvent[];
    }>;
}
