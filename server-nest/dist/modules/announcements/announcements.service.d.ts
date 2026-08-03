import { Repository } from 'typeorm';
import { Announcement } from '../../entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { EventsGateway } from '../../common/gateways/events.gateway';
export declare class AnnouncementsService {
    private announcementRepository;
    private eventsGateway;
    constructor(announcementRepository: Repository<Announcement>, eventsGateway: EventsGateway);
    create(org_id: string, author_id: string, createDto: CreateAnnouncementDto): Promise<{
        success: boolean;
        data: Announcement;
    }>;
    findAll(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Announcement[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: Announcement;
    }>;
    update(id: string, org_id: string, updateDto: UpdateAnnouncementDto): Promise<{
        success: boolean;
        data: Announcement;
    }>;
    togglePin(id: string, org_id: string): Promise<{
        success: boolean;
        data: Announcement;
    }>;
    remove(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getPinned(org_id: string): Promise<{
        success: boolean;
        data: Announcement[];
    }>;
}
