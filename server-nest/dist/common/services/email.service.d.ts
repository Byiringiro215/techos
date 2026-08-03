import { ConfigService } from '@nestjs/config';
export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
}
export declare class EmailService {
    private configService;
    private resend;
    private fromEmail;
    constructor(configService: ConfigService);
    sendEmail(options: SendEmailOptions): Promise<any>;
    sendWelcomeEmail(to: string, firstName: string, organizationName: string): Promise<any>;
    sendPasswordResetEmail(to: string, resetToken: string): Promise<any>;
    sendTaskAssignedEmail(to: string, assigneeName: string, taskTitle: string, projectName: string): Promise<any>;
    sendMeetingInviteEmail(to: string[], meetingTitle: string, startTime: string, meetingLink?: string): Promise<any>;
    sendNotificationEmail(to: string, title: string, message: string): Promise<any>;
}
