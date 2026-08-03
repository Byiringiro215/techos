import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Notification[];
    }>;
    getUnreadCount(user: any): Promise<{
        success: boolean;
        data: {
            count: number;
        };
    }>;
    markAsRead(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllAsRead(user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
