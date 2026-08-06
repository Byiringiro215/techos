"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    resend = null;
    smtp = null;
    fromEmail;
    constructor(configService) {
        this.configService = configService;
        this.fromEmail = this.configService.get('FROM_EMAIL', 'noreply@techos.local');
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (apiKey && !apiKey.startsWith('your_')) {
            this.resend = new resend_1.Resend(apiKey);
            this.logger.log('Email provider: Resend');
            return;
        }
        const smtpHost = this.configService.get('SMTP_HOST');
        if (smtpHost) {
            this.smtp = nodemailer.createTransport({
                host: smtpHost,
                port: Number(this.configService.get('SMTP_PORT') || 1025),
                secure: this.configService.get('SMTP_SECURE') === 'true',
                auth: this.configService.get('SMTP_USER')
                    ? {
                        user: this.configService.get('SMTP_USER'),
                        pass: this.configService.get('SMTP_PASS'),
                    }
                    : undefined,
            });
            this.logger.log(`Email provider: SMTP (${smtpHost})`);
        }
        else {
            this.logger.warn('No email provider configured');
        }
    }
    async sendEmail(options) {
        const to = Array.isArray(options.to) ? options.to : [options.to];
        const from = options.from || this.fromEmail;
        if (this.resend) {
            try {
                const { data, error } = await this.resend.emails.send({
                    from,
                    to,
                    subject: options.subject,
                    html: options.html,
                    replyTo: options.replyTo,
                });
                if (error) {
                    this.logger.error(`Resend error: ${JSON.stringify(error)}`);
                    return null;
                }
                return data;
            }
            catch (error) {
                this.logger.error('Failed to send email via Resend', error);
                return null;
            }
        }
        if (this.smtp) {
            try {
                return await this.smtp.sendMail({
                    from,
                    to,
                    subject: options.subject,
                    html: options.html,
                    replyTo: options.replyTo,
                });
            }
            catch (error) {
                this.logger.error('Failed to send email via SMTP', error);
                return null;
            }
        }
        this.logger.warn('Email not sent — no provider configured');
        return null;
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
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
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
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map