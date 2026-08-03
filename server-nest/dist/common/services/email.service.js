"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let EmailService = class EmailService {
    configService;
    resend;
    fromEmail;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('RESEND_API_KEY');
        this.fromEmail = this.configService.get('FROM_EMAIL', 'noreply@techos.com');
        if (apiKey) {
            this.resend = new resend_1.Resend(apiKey);
        }
    }
    async sendEmail(options) {
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
        }
        catch (error) {
            console.error('Failed to send email:', error);
            return null;
        }
    }
    async sendWelcomeEmail(to, firstName, organizationName) {
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
    async sendPasswordResetEmail(to, resetToken) {
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
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
    async sendTaskAssignedEmail(to, assigneeName, taskTitle, projectName) {
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
    async sendMeetingInviteEmail(to, meetingTitle, startTime, meetingLink) {
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
    async sendNotificationEmail(to, title, message) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map