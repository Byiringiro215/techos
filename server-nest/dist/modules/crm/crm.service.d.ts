import { Repository } from 'typeorm';
import { Contact } from '../../entities/contact.entity';
import { Deal } from '../../entities/deal.entity';
import { User } from '../../entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateDealDto } from './dto/create-deal.dto';
import { ActivityLogService } from '../../common/services/activity-log.service';
export declare class CrmService {
    private contactsRepository;
    private dealsRepository;
    private usersRepository;
    private activityLogService;
    constructor(contactsRepository: Repository<Contact>, dealsRepository: Repository<Deal>, usersRepository: Repository<User>, activityLogService: ActivityLogService);
    createContact(org_id: string, createContactDto: CreateContactDto): Promise<{
        success: boolean;
        data: Contact;
    }>;
    findAllContacts(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: {
            deal_count: number;
            total_revenue: any;
            id: string;
            org_id: string;
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
            company_name: string;
            job_title: string;
            type: string;
            status: string;
            source: string;
            notes: string;
            custom_fields: any;
            created_at: Date;
        }[];
    }>;
    findOneContact(id: string, org_id: string): Promise<{
        success: boolean;
        data: {
            deals: any[];
            id: string;
            org_id: string;
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
            company_name: string;
            job_title: string;
            type: string;
            status: string;
            source: string;
            notes: string;
            custom_fields: any;
            created_at: Date;
        };
    }>;
    updateContact(id: string, org_id: string, updateData: Partial<Contact>): Promise<{
        success: boolean;
        data: Contact;
    }>;
    deleteContact(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createDeal(org_id: string, createDealDto: CreateDealDto, actor?: any): Promise<{
        success: boolean;
        data: Deal;
    }>;
    findAllDeals(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: {
            owner_name: string;
            assigned_to: string;
            company_name: string | null;
            updated_at: Date;
            id: string;
            org_id: string;
            contact_id: string;
            title: string;
            value: number;
            currency: string;
            stage: string;
            probability: number;
            expected_close_date: string;
            notes: string;
            created_at: Date;
        }[];
    }>;
    findOneDeal(id: string, org_id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    updateDeal(id: string, org_id: string, updateData: Partial<Deal>, actor?: any): Promise<{
        success: boolean;
        data: Deal;
    }>;
    deleteDeal(id: string, org_id: string, actor?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getPipelineStats(org_id: string): Promise<{
        success: boolean;
        data: {
            pipeline: {
                stage: string;
                count: number;
                total_value: number;
            }[];
            win_rate: string;
            total_deals: number;
            total_pipeline_value: number;
            total_revenue: number;
        };
    }>;
    scoreContact(contact_id: string, org_id: string): Promise<{
        success: boolean;
        data: {
            contact_id: string;
            score: number;
            rating: string;
        };
    }>;
}
