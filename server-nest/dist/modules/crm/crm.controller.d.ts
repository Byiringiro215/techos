import { CrmService } from './crm.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateDealDto } from './dto/create-deal.dto';
export declare class CrmController {
    private crmService;
    constructor(crmService: CrmService);
    createContact(user: any, createContactDto: CreateContactDto): Promise<{
        success: boolean;
        data: import("../../entities").Contact;
    }>;
    findAllContacts(user: any, filters: any): Promise<{
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
    findOneContact(user: any, id: string): Promise<{
        success: boolean;
        data: {
            deals: {
                assigned_first_name: string | null;
                assigned_last_name: string | null;
                owner_name: string;
                id: string;
                org_id: string;
                contact_id: string;
                title: string;
                value: number;
                currency: string;
                stage: string;
                probability: number;
                expected_close_date: string;
                assigned_to: string;
                notes: string;
                created_at: Date;
            }[];
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
    updateContact(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").Contact;
    }>;
    deleteContact(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    scoreContact(user: any, id: string): Promise<{
        success: boolean;
        data: {
            contact_id: string;
            score: number;
            rating: string;
        };
    }>;
    createDeal(user: any, createDealDto: CreateDealDto): Promise<{
        success: boolean;
        data: import("../../entities").Deal;
    }>;
    findAllDeals(user: any, filters: any): Promise<{
        success: boolean;
        data: {
            owner_name: string;
            assigned_to: string;
            company_name: string | null;
            email: string | null;
            phone: string | null;
            contact_first_name: string | null;
            contact_last_name: string | null;
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
    findOneDeal(user: any, id: string): Promise<{
        success: boolean;
        data: {
            owner_name: string;
            company_name: string | null;
            email: string | null;
            phone: string | null;
            contact_first_name: string | null;
            contact_last_name: string | null;
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
            assigned_to: string;
            notes: string;
            created_at: Date;
        };
    }>;
    updateDeal(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: {
            owner_name: string;
            company_name: string | null;
            email: string | null;
            phone: string | null;
            contact_first_name: string | null;
            contact_last_name: string | null;
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
            assigned_to: string;
            notes: string;
            created_at: Date;
        };
    }>;
    deleteDeal(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getPipelineStats(user: any): Promise<{
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
    getLeadScores(user: any): Promise<{
        success: boolean;
        data: {
            contact_id: string;
            score: number;
            rating: string;
        }[];
    }>;
    calculateLeadScore(user: any, contactId: string): Promise<{
        success: boolean;
        data: {
            contact_id: string;
            score: number;
            rating: string;
        };
    }>;
    getPipelines(user: any): Promise<{
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
}
