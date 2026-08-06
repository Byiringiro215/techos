import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Contact } from '../../entities/contact.entity';
import { Deal } from '../../entities/deal.entity';
import { User } from '../../entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateDealDto } from './dto/create-deal.dto';
import { ActivityLogService } from '../../common/services/activity-log.service';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
    @InjectRepository(Deal)
    private dealsRepository: Repository<Deal>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private activityLogService: ActivityLogService,
  ) {}

  // Contacts
  async createContact(org_id: string, createContactDto: CreateContactDto) {
    const contact = this.contactsRepository.create({
      id: randomUUID(),
      org_id,
      ...createContactDto,
      type: createContactDto.type || 'lead',
      status: createContactDto.status || 'active',
    });

    await this.contactsRepository.save(contact);

    return {
      success: true,
      data: contact,
    };
  }

  async findAllContacts(org_id: string, filters?: any) {
    const where: any = { org_id };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const contacts = await this.contactsRepository.find({
      where,
      order: { created_at: 'DESC' },
    });

    // Get deal counts for each contact
    const contactsWithDeals = await Promise.all(
      contacts.map(async (contact) => {
        const dealCount = await this.dealsRepository.count({
          where: { contact_id: contact.id },
        });

        const totalValue = await this.dealsRepository
          .createQueryBuilder('deal')
          .select('SUM(deal.value)', 'total')
          .where('deal.contact_id = :contactId', { contactId: contact.id })
          .andWhere('deal.stage = :stage', { stage: 'closed_won' })
          .getRawOne();

        return {
          ...contact,
          deal_count: dealCount,
          total_revenue: totalValue?.total || 0,
        };
      }),
    );

    return {
      success: true,
      data: contactsWithDeals,
    };
  }

  async findOneContact(id: string, org_id: string) {
    const contact = await this.contactsRepository.findOne({
      where: { id, org_id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    // Get associated deals
    const deals = await this.dealsRepository
      .createQueryBuilder('deal')
      .leftJoinAndSelect(User, 'user', 'deal.assigned_to = user.id')
      .where('deal.contact_id = :contactId', { contactId: id })
      .select([
        'deal.*',
        'user.first_name as assigned_first_name',
        'user.last_name as assigned_last_name',
      ])
      .getRawMany();

    return {
      success: true,
      data: {
        ...contact,
        deals,
      },
    };
  }

  async updateContact(id: string, org_id: string, updateData: Partial<Contact>) {
    const contact = await this.contactsRepository.findOne({
      where: { id, org_id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    Object.assign(contact, updateData);
    await this.contactsRepository.save(contact);

    return {
      success: true,
      data: contact,
    };
  }

  async deleteContact(id: string, org_id: string) {
    const contact = await this.contactsRepository.findOne({
      where: { id, org_id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.contactsRepository.remove(contact);

    return {
      success: true,
      message: 'Contact deleted successfully',
    };
  }

  // Deals
  async createDeal(org_id: string, createDealDto: CreateDealDto, actor?: any) {
    let contact_id = createDealDto.contact_id;
    if (contact_id) {
      const contact = await this.contactsRepository.findOne({
        where: { id: contact_id, org_id },
      });
      if (!contact) {
        throw new NotFoundException('Contact not found');
      }
    } else {
      const contact = this.contactsRepository.create({
        id: randomUUID(),
        org_id,
        first_name: 'Deal',
        last_name: 'Lead',
        company_name: createDealDto.title,
        type: 'lead',
        status: 'qualified',
        notes: createDealDto.notes || createDealDto.description,
      });
      await this.contactsRepository.save(contact);
      contact_id = contact.id;
    }

    const deal = this.dealsRepository.create({
      id: randomUUID(),
      org_id,
      contact_id,
      title: createDealDto.title,
      value: Number(createDealDto.value || 0),
      stage: createDealDto.stage || 'qualification',
      currency: createDealDto.currency || 'USD',
      probability: createDealDto.probability || 0,
      expected_close_date: createDealDto.expected_close_date,
      assigned_to: createDealDto.assigned_to || actor?.id,
      notes: createDealDto.notes || createDealDto.description,
    });

    await this.dealsRepository.save(deal);
    await this.activityLogService.log({
      org_id,
      actor,
      action: 'created',
      resource_type: 'deals',
      resource_id: deal.id,
      summary: `created deal "${deal.title || 'Untitled'}"`,
    });

    return {
      success: true,
      data: deal,
    };
  }

  async findAllDeals(org_id: string, filters?: any) {
    const where: any = { org_id };

    if (filters?.stage) {
      where.stage = filters.stage;
    }

    if (filters?.assigned_to) {
      where.assigned_to = filters.assigned_to;
    }

    const deals = await this.dealsRepository.find({
      where,
      order: { created_at: 'DESC' },
    });

    const ownerIds = [...new Set(deals.map((d) => d.assigned_to).filter(Boolean))];
    const owners = ownerIds.length
      ? await this.usersRepository.find({ where: { id: In(ownerIds) } })
      : [];
    const ownerMap = new Map(owners.map((u) => [u.id, u]));

    const contactIds = [...new Set(deals.map((d) => d.contact_id).filter(Boolean))];
    const contacts = contactIds.length
      ? await this.contactsRepository.find({ where: { id: In(contactIds) } })
      : [];
    const contactMap = new Map(contacts.map((c) => [c.id, c]));

    const data = deals.map((deal) => {
      const owner = ownerMap.get(deal.assigned_to);
      const contact = contactMap.get(deal.contact_id);
      const owner_name = owner
        ? `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || owner.email
        : '—';
      return {
        ...deal,
        owner_name,
        assigned_to: deal.assigned_to,
        company_name: contact?.company_name || null,
        updated_at: deal.created_at,
      };
    });

    return {
      success: true,
      data,
    };
  }

  async findOneDeal(id: string, org_id: string) {
    const deal = await this.dealsRepository
      .createQueryBuilder('deal')
      .leftJoinAndSelect(Contact, 'contact', 'deal.contact_id = contact.id')
      .leftJoinAndSelect(User, 'user', 'deal.assigned_to = user.id')
      .where('deal.id = :id', { id })
      .andWhere('deal.org_id = :org_id', { org_id })
      .select([
        'deal.*',
        'contact.*',
        'user.first_name as assigned_first_name',
        'user.last_name as assigned_last_name',
      ])
      .getRawOne();

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return {
      success: true,
      data: deal,
    };
  }

  async updateDeal(id: string, org_id: string, updateData: Partial<Deal>, actor?: any) {
    const deal = await this.dealsRepository.findOne({
      where: { id, org_id },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    Object.assign(deal, updateData);
    await this.dealsRepository.save(deal);
    await this.activityLogService.log({
      org_id,
      actor,
      action: 'updated',
      resource_type: 'deals',
      resource_id: deal.id,
      summary: `updated deal "${deal.title || 'Untitled'}"`,
      changes: updateData as any,
    });

    return {
      success: true,
      data: deal,
    };
  }

  async deleteDeal(id: string, org_id: string, actor?: any) {
    const deal = await this.dealsRepository.findOne({
      where: { id, org_id },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const title = deal.title;
    await this.dealsRepository.remove(deal);
    await this.activityLogService.log({
      org_id,
      actor,
      action: 'deleted',
      resource_type: 'deals',
      resource_id: id,
      summary: `deleted deal "${title || 'Untitled'}"`,
    });

    return {
      success: true,
      message: 'Deal deleted successfully',
    };
  }

  // Pipeline Analytics
  async getPipelineStats(org_id: string) {
    const stages = ['qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
    
    const stats = await Promise.all(
      stages.map(async (stage) => {
        const result = await this.dealsRepository
          .createQueryBuilder('deal')
          .select('COUNT(*)', 'count')
          .addSelect('SUM(deal.value)', 'total_value')
          .where('deal.org_id = :org_id', { org_id })
          .andWhere('deal.stage = :stage', { stage })
          .getRawOne();

        return {
          stage,
          count: parseInt(result.count) || 0,
          total_value: parseFloat(result.total_value) || 0,
        };
      }),
    );

    // Calculate win rate
    const wonCount = stats.find(s => s.stage === 'closed_won')?.count || 0;
    const lostCount = stats.find(s => s.stage === 'closed_lost')?.count || 0;
    const totalClosed = wonCount + lostCount;
    const winRate = totalClosed > 0 ? (wonCount / totalClosed) * 100 : 0;

    return {
      success: true,
      data: {
        pipeline: stats,
        win_rate: winRate.toFixed(2),
        total_deals: stats.reduce((sum, s) => sum + s.count, 0),
        total_pipeline_value: stats
          .filter(s => !['closed_won', 'closed_lost'].includes(s.stage))
          .reduce((sum, s) => sum + s.total_value, 0),
        total_revenue: stats.find(s => s.stage === 'closed_won')?.total_value || 0,
      },
    };
  }

  // Lead Scoring (simple algorithm)
  async scoreContact(contact_id: string, org_id: string) {
    const contact = await this.contactsRepository.findOne({
      where: { id: contact_id, org_id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    let score = 0;

    // Email exists: +20
    if (contact.email) score += 20;

    // Phone exists: +10
    if (contact.phone) score += 10;

    // Company name exists: +15
    if (contact.company_name) score += 15;

    // Has deals: +25 per deal
    const dealCount = await this.dealsRepository.count({
      where: { contact_id },
    });
    score += dealCount * 25;

    // Recent activity (created in last 30 days): +20
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (new Date(contact.created_at) > thirtyDaysAgo) {
      score += 20;
    }

    // Cap at 100
    score = Math.min(score, 100);

    return {
      success: true,
      data: {
        contact_id,
        score,
        rating: score >= 80 ? 'hot' : score >= 50 ? 'warm' : 'cold',
      },
    };
  }
}
