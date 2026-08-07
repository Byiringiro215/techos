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
            participant_ids: string[];
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
            organizer_name: string | null;
            owner: string;
            participants: {
                id: string;
                user_id: string;
                status: string;
                is_organizer: boolean;
                first_name: string | null;
                last_name: string | null;
                email: string | null;
                avatar: string | null;
                name: string | null;
            }[];
            participant_ids: string[];
            action_items: {
                assignee_first_name: string | null;
                assignee_last_name: string | null;
                assignee_name: string | null;
                id: string;
                meeting_id: string;
                title: string;
                description: string;
                assignee_id: string;
                status: string;
                due_date: string;
                created_at: Date;
            }[];
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
            organizer_name: string | null;
            owner: string;
            participants: {
                id: string;
                user_id: string;
                status: string;
                is_organizer: boolean;
                first_name: string | null;
                last_name: string | null;
                email: string | null;
                avatar: string | null;
                name: string | null;
            }[];
            participant_ids: string[];
            action_items: {
                assignee_first_name: string | null;
                assignee_last_name: string | null;
                assignee_name: string | null;
                id: string;
                meeting_id: string;
                title: string;
                description: string;
                assignee_id: string;
                status: string;
                due_date: string;
                created_at: Date;
            }[];
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
