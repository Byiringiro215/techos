import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsController {
    private announcementsService;
    constructor(announcementsService: AnnouncementsService);
    create(user: any, createDto: CreateAnnouncementDto): Promise<{
        success: boolean;
        data: import("../../entities").Announcement;
    }>;
    findAll(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Announcement[];
    }>;
    getPinned(user: any): Promise<{
        success: boolean;
        data: import("../../entities").Announcement[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Announcement;
    }>;
    update(user: any, id: string, updateDto: UpdateAnnouncementDto): Promise<{
        success: boolean;
        data: import("../../entities").Announcement;
    }>;
    togglePin(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Announcement;
    }>;
    pin(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Announcement;
    }>;
    unpin(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Announcement;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
