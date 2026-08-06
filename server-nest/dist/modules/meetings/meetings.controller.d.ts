import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { CreateActionItemDto } from './dto/create-action-item.dto';
export declare class MeetingsController {
    private meetingsService;
    constructor(meetingsService: MeetingsService);
    create(user: any, createMeetingDto: CreateMeetingDto): Promise<{
        success: boolean;
        data: import("../../entities").Meeting;
    }>;
    findAll(user: any, filters: any): Promise<{
        success: boolean;
        data: {
            participant_count: number;
            action_item_count: number;
            id: string;
            org_id: string;
            title: string;
            description: string;
            date: string;
            scheduled_at: string;
            start_time: string;
            end_time: string;
            location: string;
            meeting_link: string;
            type: string;
            status: string;
            organizer_id: string;
            agenda: string;
            notes: string;
            ai_summary: string;
            decisions: string[];
            recording_url: string;
            created_at: Date;
        }[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: {
            participants: any[];
            action_items: any[];
            id: string;
            org_id: string;
            title: string;
            description: string;
            date: string;
            scheduled_at: string;
            start_time: string;
            end_time: string;
            location: string;
            meeting_link: string;
            type: string;
            status: string;
            organizer_id: string;
            agenda: string;
            notes: string;
            ai_summary: string;
            decisions: string[];
            recording_url: string;
            created_at: Date;
        };
    }>;
    update(user: any, id: string, updateMeetingDto: UpdateMeetingDto): Promise<{
        success: boolean;
        data: {
            success: boolean;
            data: {
                participants: any[];
                action_items: any[];
                id: string;
                org_id: string;
                title: string;
                description: string;
                date: string;
                scheduled_at: string;
                start_time: string;
                end_time: string;
                location: string;
                meeting_link: string;
                type: string;
                status: string;
                organizer_id: string;
                agenda: string;
                notes: string;
                ai_summary: string;
                decisions: string[];
                recording_url: string;
                created_at: Date;
            };
        };
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addParticipants(user: any, id: string, body: {
        participant_ids: string[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    removeParticipant(user: any, id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateParticipantStatus(id: string, userId: string, body: {
        status: 'accepted' | 'declined';
    }): Promise<{
        success: boolean;
        data: import("../../entities").MeetingParticipant;
    }>;
    createActionItem(user: any, id: string, createActionItemDto: CreateActionItemDto): Promise<{
        success: boolean;
        data: import("../../entities").MeetingActionItem;
    }>;
    getActionItems(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").MeetingActionItem[];
    }>;
    updateActionItem(id: string, actionItemId: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").MeetingActionItem;
    }>;
    updateActionItemById(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").MeetingActionItem | null;
    }>;
    deleteActionItem(id: string, actionItemId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
