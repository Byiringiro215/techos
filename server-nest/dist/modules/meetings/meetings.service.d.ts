import { Repository } from 'typeorm';
import { Meeting } from '../../entities/meeting.entity';
import { MeetingParticipant } from '../../entities/meeting-participant.entity';
import { MeetingActionItem } from '../../entities/meeting-action-item.entity';
import { User } from '../../entities/user.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { EmailService } from '../../common/services/email.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class MeetingsService {
    private meetingsRepository;
    private participantsRepository;
    private actionItemsRepository;
    private usersRepository;
    private emailService;
    private notificationsService;
    constructor(meetingsRepository: Repository<Meeting>, participantsRepository: Repository<MeetingParticipant>, actionItemsRepository: Repository<MeetingActionItem>, usersRepository: Repository<User>, emailService: EmailService, notificationsService: NotificationsService);
    private userLabel;
    private assertCanAccessMeeting;
    create(org_id: string, actor: {
        id: string;
        role?: string;
    }, createMeetingDto: CreateMeetingDto): Promise<{
        success: boolean;
        data: Meeting;
    }>;
    findAll(org_id: string, user?: {
        id?: string;
        role?: string;
    }, filters?: any): Promise<{
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
    findOne(id: string, org_id: string, user?: {
        id?: string;
        role?: string;
    }): Promise<{
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
    update(id: string, org_id: string, updateMeetingDto: UpdateMeetingDto, user?: {
        id?: string;
        role?: string;
    }): Promise<{
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
    remove(id: string, org_id: string, user?: {
        id?: string;
        role?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    addParticipant(meeting_id: string, user_id: string, is_organizer?: boolean): Promise<MeetingParticipant>;
    addParticipants(meeting_id: string, org_id: string, participant_ids: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
    removeParticipant(meeting_id: string, org_id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateParticipantStatus(meeting_id: string, user_id: string, status: 'accepted' | 'declined'): Promise<{
        success: boolean;
        data: MeetingParticipant;
    }>;
    createActionItem(meeting_id: string, org_id: string, createActionItemDto: CreateActionItemDto): Promise<{
        success: boolean;
        data: MeetingActionItem;
    }>;
    updateActionItem(id: string, meeting_id: string, updateData: Partial<MeetingActionItem>): Promise<{
        success: boolean;
        data: MeetingActionItem;
    }>;
    updateActionItemById(id: string, org_id: string, updateData: Partial<MeetingActionItem>): Promise<{
        success: boolean;
        data: MeetingActionItem | null;
    }>;
    getActionItems(meeting_id: string, org_id: string): Promise<{
        success: boolean;
        data: MeetingActionItem[];
    }>;
    deleteActionItem(id: string, meeting_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private sendMeetingInvites;
}
