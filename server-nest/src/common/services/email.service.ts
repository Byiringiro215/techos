import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

@Injectable()
export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('FROM_EMAIL', 'noreply@techos.com');
    
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<any> {
    if (!this.resend) {
      console.warn('Resend API key not configured. Email not sent.');
      return null;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: options.from || this.fromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      });

      if (error) {
        console.error('Email send error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to send email:', error);
      return null;
    }
  }

  async sendWelcomeEmail(to: string, firstName: string, organizationName: string): Promise<any> {
    return this.sendEmail({
      to,
      subject: `Welcome to ${organizationName} on TechOS`,
      html: `
        <h1>Welcome to TechOS, ${firstName}!</h1>
        <p>Your organization <strong>${organizationName}</strong> has been successfully created.</p>
        <p>You can now start managing your projects, tasks, and team collaboration all in one place.</p>
        <p>Best regards,<br>The TechOS Team</p>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<any> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    return this.sendEmail({
      to,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  async sendTaskAssignedEmail(
    to: string,
    assigneeName: string,
    taskTitle: string,
    projectName: string,
  ): Promise<any> {
    return this.sendEmail({
      to,
      subject: `New Task Assigned: ${taskTitle}`,
      html: `
        <h1>New Task Assigned</h1>
        <p>Hi ${assigneeName},</p>
        <p>You have been assigned a new task:</p>
        <p><strong>${taskTitle}</strong> in project <strong>${projectName}</strong></p>
        <p>Log in to TechOS to view details and start working on it.</p>
      `,
    });
  }

  async sendMeetingInviteEmail(
    to: string[],
    meetingTitle: string,
    startTime: string,
    meetingLink?: string,
  ): Promise<any> {
    return this.sendEmail({
      to,
      subject: `Meeting Invitation: ${meetingTitle}`,
      html: `
        <h1>You're Invited to a Meeting</h1>
        <p><strong>Meeting:</strong> ${meetingTitle}</p>
        <p><strong>Time:</strong> ${new Date(startTime).toLocaleString()}</p>
        ${meetingLink ? `<p><a href="${meetingLink}">Join Meeting</a></p>` : ''}
        <p>See you there!</p>
      `,
    });
  }

  async sendNotificationEmail(to: string, title: string, message: string): Promise<any> {
    return this.sendEmail({
      to,
      subject: title,
      html: `
        <h2>${title}</h2>
        <p>${message}</p>
        <p>Log in to TechOS for more details.</p>
      `,
    });
  }
}
