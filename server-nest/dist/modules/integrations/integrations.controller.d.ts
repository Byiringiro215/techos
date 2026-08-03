import { IntegrationsService } from './integrations.service';
export declare class IntegrationsController {
    private integrationsService;
    constructor(integrationsService: IntegrationsService);
    getAvailableIntegrations(): Promise<{
        success: boolean;
        data: {
            type: string;
            name: string;
            description: string;
        }[];
    }>;
    create(user: any, createDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Integration[];
    }>;
    findAll(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Integration[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Integration;
    }>;
    update(user: any, id: string, updateDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Integration;
    }>;
    toggleEnabled(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Integration;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    saveOAuthTokens(user: any, type: string, tokens: any): Promise<{
        success: boolean;
        data: import("../../entities").Integration;
    }>;
    handleGitHubWebhook(payload: any, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    handleGitLabWebhook(payload: any, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    handleStripeWebhook(payload: any): Promise<{
        success: boolean;
        message: string;
    }>;
    handleSlackWebhook(payload: any, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    syncGitHubIssues(user: any, repo: string): Promise<{
        success: boolean;
        message: string;
        note: string;
    }>;
    syncGoogleCalendar(user: any): Promise<{
        success: boolean;
        message: string;
        note: string;
    }>;
    sendSlackNotification(user: any, channel: string, message: string): Promise<{
        success: boolean;
        message: string;
        note: string;
    }>;
}
