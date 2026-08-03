import { AiService } from './ai.service';
export declare class AiController {
    private aiService;
    constructor(aiService: AiService);
    chat(user: any, message: string, provider?: 'openai' | 'claude' | 'gemini' | 'grok'): Promise<{
        success: boolean;
        data: {
            message: string;
            provider: "openai" | "claude" | "gemini" | "grok";
            timestamp: string;
        };
    }>;
    generateReport(user: any, type: string, provider?: 'openai' | 'claude' | 'gemini' | 'grok'): Promise<{
        success: boolean;
        data: {
            message: string;
            provider: "openai" | "claude" | "gemini" | "grok";
            timestamp: string;
        };
    }>;
    analyzeRisk(user: any, provider?: 'openai' | 'claude' | 'gemini' | 'grok'): Promise<{
        success: boolean;
        data: {
            message: string;
            provider: "openai" | "claude" | "gemini" | "grok";
            timestamp: string;
        };
    }>;
    suggestPriorities(user: any, provider?: 'openai' | 'claude' | 'gemini' | 'grok'): Promise<{
        success: boolean;
        data: {
            message: string;
            provider: "openai" | "claude" | "gemini" | "grok";
            timestamp: string;
        };
    }>;
}
