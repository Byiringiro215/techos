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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const notification_entity_1 = require("../../entities/notification.entity");
const user_entity_1 = require("../../entities/user.entity");
const events_gateway_1 = require("../../common/gateways/events.gateway");
const email_service_1 = require("../../common/services/email.service");
let NotificationsService = class NotificationsService {
    notificationsRepository;
    usersRepository;
    eventsGateway;
    emailService;
    constructor(notificationsRepository, usersRepository, eventsGateway, emailService) {
        this.notificationsRepository = notificationsRepository;
        this.usersRepository = usersRepository;
        this.eventsGateway = eventsGateway;
        this.emailService = emailService;
    }
    async create(org_id, createDto) {
        const notification = this.notificationsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            user_id: createDto.user_id,
            type: createDto.type,
            title: createDto.title,
            message: createDto.message,
            link: createDto.link,
            metadata: createDto.metadata,
            read: false,
        });
        await this.notificationsRepository.save(notification);
        this.eventsGateway.sendNotificationToUser(createDto.user_id, notification);
        if (createDto.send_email) {
            const user = await this.usersRepository.findOne({ where: { id: createDto.user_id } });
            if (user && user.email) {
                await this.emailService.sendNotificationEmail(user.email, createDto.title, createDto.message);
            }
        }
        return {
            success: true,
            data: notification,
        };
    }
    async findAll(user_id, filters) {
        const where = { user_id };
        if (filters?.read !== undefined) {
            where.read = filters.read;
        }
        if (filters?.type) {
            where.type = filters.type;
        }
        const notifications = await this.notificationsRepository.find({
            where,
            order: { created_at: 'DESC' },
            take: 100,
        });
        return {
            success: true,
            data: notifications,
        };
    }
    async getUnreadCount(user_id) {
        const count = await this.notificationsRepository.count({
            where: { user_id, read: false },
        });
        return {
            success: true,
            data: { count },
        };
    }
    async markAsRead(id, user_id) {
        const notification = await this.notificationsRepository.findOne({
            where: { id, user_id },
        });
        if (notification) {
            notification.read = true;
            await this.notificationsRepository.save(notification);
        }
        return {
            success: true,
            message: 'Notification marked as read',
        };
    }
    async markAllAsRead(user_id) {
        await this.notificationsRepository.update({ user_id, read: false }, { read: true });
        return {
            success: true,
            message: 'All notifications marked as read',
        };
    }
    async remove(id, user_id) {
        await this.notificationsRepository.delete({ id, user_id });
        return {
            success: true,
            message: 'Notification deleted',
        };
    }
    async notifyTaskAssigned(task_id, task_title, assignee_id, project_name, org_id) {
        return this.create(org_id, {
            user_id: assignee_id,
            type: 'task_assigned',
            title: 'New Task Assigned',
            message: `You have been assigned to task: ${task_title} in ${project_name}`,
            link: `/tasks/${task_id}`,
            metadata: { task_id, project_name },
            send_email: true,
        });
    }
    async notifyMeetingInvite(meeting_id, meeting_title, participant_id, start_time, org_id) {
        return this.create(org_id, {
            user_id: participant_id,
            type: 'meeting_invite',
            title: 'Meeting Invitation',
            message: `You've been invited to: ${meeting_title} at ${start_time}`,
            link: `/meetings/${meeting_id}`,
            metadata: { meeting_id, start_time },
            send_email: true,
        });
    }
    async notifyMention(mentioning_user_id, mentioned_user_id, channel_id, message_preview, org_id) {
        const user = await this.usersRepository.findOne({ where: { id: mentioning_user_id } });
        const userName = user ? `${user.first_name} ${user.last_name}` : 'Someone';
        return this.create(org_id, {
            user_id: mentioned_user_id,
            type: 'mention',
            title: 'You were mentioned',
            message: `${userName} mentioned you: ${message_preview}`,
            link: `/channels/${channel_id}`,
            metadata: { channel_id, mentioning_user_id },
        });
    }
    async notifyDeadlineApproaching(task_id, task_title, assignee_id, due_date, org_id) {
        return this.create(org_id, {
            user_id: assignee_id,
            type: 'deadline_approaching',
            title: 'Deadline Approaching',
            message: `Task "${task_title}" is due on ${due_date}`,
            link: `/tasks/${task_id}`,
            metadata: { task_id, due_date },
            send_email: true,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        events_gateway_1.EventsGateway,
        email_service_1.EmailService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map