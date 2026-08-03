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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const calendar_event_entity_1 = require("../../entities/calendar-event.entity");
const user_entity_1 = require("../../entities/user.entity");
let CalendarService = class CalendarService {
    eventsRepository;
    usersRepository;
    constructor(eventsRepository, usersRepository) {
        this.eventsRepository = eventsRepository;
        this.usersRepository = usersRepository;
    }
    async create(org_id, user_id, createEventDto) {
        const event = this.eventsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createEventDto,
            created_by: user_id,
            all_day: createEventDto.all_day || false,
            type: createEventDto.type || 'event',
        });
        await this.eventsRepository.save(event);
        return {
            success: true,
            data: event,
        };
    }
    async findAll(org_id, start_date, end_date, type) {
        const queryBuilder = this.eventsRepository
            .createQueryBuilder('event')
            .where('event.org_id = :org_id', { org_id });
        if (start_date && end_date) {
            queryBuilder.andWhere('event.start_datetime BETWEEN :start AND :end', {
                start: start_date,
                end: end_date,
            });
        }
        if (type) {
            queryBuilder.andWhere('event.type = :type', { type });
        }
        const events = await queryBuilder
            .orderBy('event.start_datetime', 'ASC')
            .getMany();
        return {
            success: true,
            data: events,
        };
    }
    async findOne(id, org_id) {
        const event = await this.eventsRepository.findOne({
            where: { id, org_id },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return {
            success: true,
            data: event,
        };
    }
    async update(id, org_id, updateData) {
        const event = await this.eventsRepository.findOne({
            where: { id, org_id },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        Object.assign(event, updateData);
        await this.eventsRepository.save(event);
        return {
            success: true,
            data: event,
        };
    }
    async remove(id, org_id) {
        const event = await this.eventsRepository.findOne({
            where: { id, org_id },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        await this.eventsRepository.remove(event);
        return {
            success: true,
            message: 'Event deleted successfully',
        };
    }
    async getUserEvents(org_id, user_id, start_date, end_date) {
        const queryBuilder = this.eventsRepository
            .createQueryBuilder('event')
            .where('event.org_id = :org_id', { org_id })
            .andWhere('event.attendees LIKE :user_id', { user_id: `%${user_id}%` });
        if (start_date && end_date) {
            queryBuilder.andWhere('event.start_datetime BETWEEN :start AND :end', {
                start: start_date,
                end: end_date,
            });
        }
        const events = await queryBuilder
            .orderBy('event.start_datetime', 'ASC')
            .getMany();
        return {
            success: true,
            data: events,
        };
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calendar_event_entity_1.CalendarEvent)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map