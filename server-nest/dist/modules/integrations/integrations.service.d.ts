import { Repository } from 'typeorm';
import { Integration } from '../../entities/integration.entity';
export declare class IntegrationsService {
    private integrationRepository;
    constructor(integrationRepository: Repository<Integration>);
    create(org_id: string, createDto: any): Promise<{
        success: boolean;
        data: Integration[];
    }>;
    findAll(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Integration[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: Integration;
    }>;
    findByType(org_id: string, type: string): Promise<Integration | null>;
    update(id: string, org_id: string, updateDto: any): Promise<{
        success: boolean;
        data: Integration;
    }>;
    remove(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleEnabled(id: string, org_id: string): Promise<{
        success: boolean;
        data: Integration;
    }>;
    saveOAuthTokens(org_id: string, type: string, tokens: any): Promise<{
        success: boolean;
        data: Integration;
    }>;
    getOAuthTokens(org_id: string, type: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_at: string;
    }>;
    handleGitHubWebhook(org_id: string, payload: any): Promise<{
        success: boolean;
        message: string;
    }>;
    handleGitLabWebhook(org_id: string, payload: any): Promise<{
        success: boolean;
        message: string;
    }>;
    handleStripeWebhook(payload: any): Promise<{
        success: boolean;
        message: string;
    }>;
    handleSlackWebhook(org_id: string, payload: any): Promise<{
        success: boolean;
        message: string;
    }>;
    syncGitHubIssues(org_id: string, repo: string): Promise<{
        success: boolean;
        message: string;
        note: string;
    }>;
    syncGoogleCalendar(org_id: string): Promise<{
        success: boolean;
        message: string;
        note: string;
    }>;
    sendSlackNotification(org_id: string, channel: string, message: string): Promise<{
        success: boolean;
        message: string;
        note: string;
    }>;
    getAvailableIntegrations(): Promise<{
        success: boolean;
        data: {
            type: string;
            name: string;
            description: string;
        }[];
    }>;
}
