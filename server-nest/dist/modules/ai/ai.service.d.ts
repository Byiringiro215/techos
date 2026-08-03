import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Project } from '../../entities/project.entity';
import { Task } from '../../entities/task.entity';
import { Bug } from '../../entities/bug.entity';
import { User } from '../../entities/user.entity';
import { Invoice } from '../../entities/invoice.entity';
import { Expense } from '../../entities/expense.entity';
import { Goal } from '../../entities/goal.entity';
import { KPI } from '../../entities/kpi.entity';
import { Meeting } from '../../entities/meeting.entity';
import { Sprint } from '../../entities/sprint.entity';
type AIProvider = 'openai' | 'claude' | 'gemini' | 'grok';
export declare class AiService {
    private configService;
    private projectRepository;
    private taskRepository;
    private bugRepository;
    private userRepository;
    private invoiceRepository;
    private expenseRepository;
    private goalRepository;
    private kpiRepository;
    private meetingRepository;
    private sprintRepository;
    private openai;
    private anthropic;
    private gemini;
    private grokApiKey;
    constructor(configService: ConfigService, projectRepository: Repository<Project>, taskRepository: Repository<Task>, bugRepository: Repository<Bug>, userRepository: Repository<User>, invoiceRepository: Repository<Invoice>, expenseRepository: Repository<Expense>, goalRepository: Repository<Goal>, kpiRepository: Repository<KPI>, meetingRepository: Repository<Meeting>, sprintRepository: Repository<Sprint>);
    chat(org_id: string, user_id: string, message: string, provider?: AIProvider): Promise<{
        success: boolean;
        data: {
            message: string;
            provider: AIProvider;
            timestamp: string;
        };
    }>;
    private gatherSystemContext;
    private buildSystemPrompt;
    private callOpenAI;
    private callClaude;
    private callGemini;
    private callGrok;
    generateReport(org_id: string, reportType: string, provider?: AIProvider): Promise<{
        success: boolean;
        data: {
            message: string;
            provider: AIProvider;
            timestamp: string;
        };
    }>;
    analyzeRisk(org_id: string, provider?: AIProvider): Promise<{
        success: boolean;
        data: {
            message: string;
            provider: AIProvider;
            timestamp: string;
        };
    }>;
    suggestPriorities(org_id: string, provider?: AIProvider): Promise<{
        success: boolean;
        data: {
            message: string;
            provider: AIProvider;
            timestamp: string;
        };
    }>;
}
export {};
