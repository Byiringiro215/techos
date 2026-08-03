import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { randomUUID } from 'crypto';
import { CalendarEvent } from '../../entities/calendar-event.entity';
import { User } from '../../entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private eventsRepository: Repository<CalendarEvent>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(org_id: string, user_id: string, createEventDto: CreateEventDto) {
    const event = this.eventsRepository.create({
      id: randomUUID(),
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

  async findAll(org_id: string, start_date?: string, end_date?: string, type?: string) {
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

  async findOne(id: string, org_id: string) {
    const event = await this.eventsRepository.findOne({
      where: { id, org_id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      success: true,
      data: event,
    };
  }

  async update(id: string, org_id: string, updateData: Partial<CalendarEvent>) {
    const event = await this.eventsRepository.findOne({
      where: { id, org_id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    Object.assign(event, updateData);
    await this.eventsRepository.save(event);

    return {
      success: true,
      data: event,
    };
  }

  async remove(id: string, org_id: string) {
    const event = await this.eventsRepository.findOne({
      where: { id, org_id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.eventsRepository.remove(event);

    return {
      success: true,
      message: 'Event deleted successfully',
    };
  }

  async getUserEvents(org_id: string, user_id: string, start_date?: string, end_date?: string) {
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
}
