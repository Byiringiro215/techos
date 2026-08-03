import { Repository } from 'typeorm';
import { Meeting } from '../../entities/meeting.entity';
import { MeetingParticipant } from '../../entities/meeting-participant.entity';
import { MeetingActionItem } from '../../entities/meeting-action-item.entity';
import { User } from '../../entities/user.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { EmailService } from '../../common/services/email.service';
export declare class MeetingsService {
    private meetingsRepository;
    private participantsRepository;
    private actionItemsRepository;
    private usersRepository;
    private emailService;
    constructor(meetingsRepository: Repository<Meeting>, participantsRepository: Repository<MeetingParticipant>, actionItemsRepository: Repository<MeetingActionItem>, usersRepository: Repository<User>, emailService: EmailService);
    create(org_id: string, user_id: string, createMeetingDto: CreateMeetingDto): Promise<{
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
    findAll(org_id: string, filters?: any): Promise<{
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
    findOne(id: string, org_id: string): Promise<{
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
    update(id: string, org_id: string, updateMeetingDto: UpdateMeetingDto): Promise<{
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
    remove(id: string, org_id: string): Promise<{
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
    deleteActionItem(id: string, meeting_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private sendMeetingInvites;
}
