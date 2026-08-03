import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import { EventsGateway } from '../../common/gateways/events.gateway';
import { EmailService } from '../../common/services/email.service';
export interface CreateNotificationDto {
    user_id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    metadata?: any;
    send_email?: boolean;
}
export declare class NotificationsService {
    private notificationsRepository;
    private usersRepository;
    private eventsGateway;
    private emailService;
    constructor(notificationsRepository: Repository<Notification>, usersRepository: Repository<User>, eventsGateway: EventsGateway, emailService: EmailService);
    create(org_id: string, createDto: CreateNotificationDto): Promise<{
        success: boolean;
        data: Notification;
    }>;
    findAll(user_id: string, filters?: {
        read?: boolean;
        type?: string;
    }): Promise<{
        success: boolean;
        data: Notification[];
    }>;
    getUnreadCount(user_id: string): Promise<{
        success: boolean;
        data: {
            count: number;
        };
    }>;
    markAsRead(id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllAsRead(user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    notifyTaskAssigned(task_id: string, task_title: string, assignee_id: string, project_name: string, org_id: string): Promise<{
        success: boolean;
        data: Notification;
    }>;
    notifyMeetingInvite(meeting_id: string, meeting_title: string, participant_id: string, start_time: string, org_id: string): Promise<{
        success: boolean;
        data: Notification;
    }>;
    notifyMention(mentioning_user_id: string, mentioned_user_id: string, channel_id: string, message_preview: string, org_id: string): Promise<{
        success: boolean;
        data: Notification;
    }>;
    notifyDeadlineApproaching(task_id: string, task_title: string, assignee_id: string, due_date: string, org_id: string): Promise<{
        success: boolean;
        data: Notification;
    }>;
}
