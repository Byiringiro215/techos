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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const openai_1 = __importDefault(require("openai"));
const generative_ai_1 = require("@google/generative-ai");
const axios_1 = __importDefault(require("axios"));
const project_entity_1 = require("../../entities/project.entity");
const task_entity_1 = require("../../entities/task.entity");
const bug_entity_1 = require("../../entities/bug.entity");
const user_entity_1 = require("../../entities/user.entity");
const invoice_entity_1 = require("../../entities/invoice.entity");
const expense_entity_1 = require("../../entities/expense.entity");
const goal_entity_1 = require("../../entities/goal.entity");
const kpi_entity_1 = require("../../entities/kpi.entity");
const meeting_entity_1 = require("../../entities/meeting.entity");
const sprint_entity_1 = require("../../entities/sprint.entity");
let AiService = class AiService {
    configService;
    projectRepository;
    taskRepository;
    bugRepository;
    userRepository;
    invoiceRepository;
    expenseRepository;
    goalRepository;
    kpiRepository;
    meetingRepository;
    sprintRepository;
    openai;
    anthropic;
    gemini;
    grokApiKey;
    constructor(configService, projectRepository, taskRepository, bugRepository, userRepository, invoiceRepository, expenseRepository, goalRepository, kpiRepository, meetingRepository, sprintRepository) {
        this.configService = configService;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.bugRepository = bugRepository;
        this.userRepository = userRepository;
        this.invoiceRepository = invoiceRepository;
        this.expenseRepository = expenseRepository;
        this.goalRepository = goalRepository;
        this.kpiRepository = kpiRepository;
        this.meetingRepository = meetingRepository;
        this.sprintRepository = sprintRepository;
        const openaiKey = this.configService.get('OPENAI_API_KEY');
        const anthropicKey = this.configService.get('ANTHROPIC_API_KEY');
        const geminiKey = this.configService.get('GEMINI_API_KEY');
        this.grokApiKey = this.configService.get('GROK_API_KEY');
        if (openaiKey) {
            this.openai = new openai_1.default({ apiKey: openaiKey });
        }
        if (anthropicKey) {
            this.anthropic = new sdk_1.default({ apiKey: anthropicKey });
        }
        if (geminiKey) {
            this.gemini = new generative_ai_1.GoogleGenerativeAI(geminiKey);
        }
    }
    async chat(org_id, user_id, message, provider = 'openai') {
        const context = await this.gatherSystemContext(org_id);
        const systemPrompt = this.buildSystemPrompt(context);
        let response;
        switch (provider) {
            case 'openai':
                response = await this.callOpenAI(systemPrompt, message);
                break;
            case 'claude':
                response = await this.callClaude(systemPrompt, message);
                break;
            case 'gemini':
                response = await this.callGemini(systemPrompt, message);
                break;
            case 'grok':
                response = await this.callGrok(systemPrompt, message);
                break;
            default:
                throw new common_1.BadRequestException('Invalid AI provider');
        }
        return {
            success: true,
            data: {
                message: response,
                provider,
                timestamp: new Date().toISOString(),
            },
        };
    }
    async gatherSystemContext(org_id) {
        const [projects, tasks, bugs, users, invoices, expenses, goals, kpis, meetings, sprints] = await Promise.all([
            this.projectRepository.find({ where: { org_id }, take: 100 }),
            this.taskRepository.find({ where: { org_id }, take: 100, order: { created_at: 'DESC' } }),
            this.bugRepository.find({ where: { org_id }, take: 50, order: { created_at: 'DESC' } }),
            this.userRepository.find({ where: { org_id } }),
            this.invoiceRepository.find({ where: { org_id }, take: 50, order: { created_at: 'DESC' } }),
            this.expenseRepository.find({ where: { org_id }, take: 50, order: { created_at: 'DESC' } }),
            this.goalRepository.find({ where: { org_id, status: 'active' } }),
            this.kpiRepository.find({ where: { org_id } }),
            this.meetingRepository.find({ where: { org_id }, take: 20, order: { scheduled_at: 'DESC' } }),
            this.sprintRepository.find({ where: { org_id }, take: 10, order: { created_at: 'DESC' } }),
        ]);
        const projectStats = {
            total: projects.length,
            active: projects.filter(p => p.status === 'active').length,
            completed: projects.filter(p => p.status === 'completed').length,
        };
        const taskStats = {
            total: tasks.length,
            todo: tasks.filter(t => t.status === 'todo').length,
            in_progress: tasks.filter(t => t.status === 'in_progress').length,
            done: tasks.filter(t => t.status === 'done').length,
        };
        const bugStats = {
            total: bugs.length,
            open: bugs.filter(b => b.status === 'open').length,
            critical: bugs.filter(b => b.severity === 'critical').length,
        };
        const financialStats = {
            total_revenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
            total_expenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
            net_profit: invoices.reduce((sum, inv) => sum + inv.amount, 0) - expenses.reduce((sum, exp) => sum + exp.amount, 0),
        };
        const goalStats = {
            total: goals.length,
            average_progress: goals.reduce((sum, g) => sum + g.progress, 0) / goals.length || 0,
        };
        return {
            projects: projects.slice(0, 10),
            tasks: tasks.slice(0, 20),
            bugs: bugs.slice(0, 10),
            users,
            invoices: invoices.slice(0, 10),
            expenses: expenses.slice(0, 10),
            goals,
            kpis,
            meetings: meetings.slice(0, 5),
            sprints: sprints.slice(0, 3),
            statistics: {
                projects: projectStats,
                tasks: taskStats,
                bugs: bugStats,
                financial: financialStats,
                goals: goalStats,
                team_size: users.length,
            },
        };
    }
    buildSystemPrompt(context) {
        return `You are an intelligent AI assistant for TechOS, a comprehensive operating system for software companies.

You have COMPLETE access to the following real-time data from the organization:

# SYSTEM CAPABILITIES
- Project Management (${context.statistics.projects.total} projects)
- Task Management (${context.statistics.tasks.total} tasks)
- Bug Tracking (${context.statistics.bugs.total} bugs)
- CRM (Contacts & Deals)
- Finance (Invoices & Expenses)
- HR (Employees & Leave)
- Goals & OKRs (${context.goals.length} active goals)
- Meetings & Collaboration
- Analytics & Reports
- Document Management

# CURRENT STATISTICS
Projects: ${context.statistics.projects.active} active, ${context.statistics.projects.completed} completed
Tasks: ${context.statistics.tasks.in_progress} in progress, ${context.statistics.tasks.done} done, ${context.statistics.tasks.todo} pending
Bugs: ${context.statistics.bugs.open} open, ${context.statistics.bugs.critical} critical
Financial: Revenue $${context.statistics.financial.total_revenue}, Expenses $${context.statistics.financial.total_expenses}, Net $${context.statistics.financial.net_profit}
Team: ${context.statistics.team_size} members
Goals: Average ${context.statistics.goals.average_progress.toFixed(1)}% progress

# RECENT PROJECTS
${context.projects.map(p => `- ${p.name} (${p.status}): ${p.description || 'No description'}`).join('\n')}

# RECENT TASKS (Sample)
${context.tasks.slice(0, 10).map(t => `- ${t.title} [${t.status}] - Priority: ${t.priority}`).join('\n')}

# ACTIVE GOALS
${context.goals.map(g => `- ${g.title}: ${g.progress}% complete`).join('\n')}

# KEY PERFORMANCE INDICATORS
${context.kpis.map(k => `- ${k.name}: ${k.current}/${k.target} ${k.unit}`).join('\n')}

# RECENT BUGS
${context.bugs.slice(0, 5).map(b => `- ${b.title} [${b.severity}/${b.priority}]`).join('\n')}

# ACTIVE SPRINTS
${context.sprints.filter(s => s.status === 'active').map(s => `- ${s.name} (${s.start_date} to ${s.end_date})`).join('\n')}

INSTRUCTIONS:
- Answer questions accurately based on the real data above
- Provide insights and recommendations based on patterns you see
- Calculate and analyze data when asked
- Suggest actionable improvements
- Be concise but comprehensive
- When asked about specific data, reference actual numbers
- If data is not available, clearly state that

You can answer questions like:
- "What's our project completion rate?"
- "Which bugs are most critical?"
- "How is our financial performance?"
- "What are our team's top priorities?"
- "Generate a status report"
- "What goals are at risk?"
- "Analyze our sprint velocity"
- And many more...`;
    }
    async callOpenAI(systemPrompt, userMessage) {
        if (!this.openai) {
            throw new common_1.BadRequestException('OpenAI API key not configured');
        }
        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });
        return completion.choices[0].message.content || 'No response generated';
    }
    async callClaude(systemPrompt, userMessage) {
        if (!this.anthropic) {
            throw new common_1.BadRequestException('Claude API key not configured');
        }
        const message = await this.anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            system: systemPrompt,
            messages: [
                { role: 'user', content: userMessage },
            ],
        });
        return message.content[0].type === 'text' ? message.content[0].text : '';
    }
    async callGemini(systemPrompt, userMessage) {
        if (!this.gemini) {
            throw new common_1.BadRequestException('Gemini API key not configured');
        }
        const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'I understand. I am your TechOS AI assistant with complete system context.' }],
                },
            ],
        });
        const result = await chat.sendMessage(userMessage);
        return result.response.text();
    }
    async callGrok(systemPrompt, userMessage) {
        if (!this.grokApiKey) {
            throw new common_1.BadRequestException('Grok API key not configured');
        }
        const response = await axios_1.default.post('https://api.x.ai/v1/chat/completions', {
            model: 'grok-beta',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }, {
            headers: {
                'Authorization': `Bearer ${this.grokApiKey}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.choices[0].message.content;
    }
    async generateReport(org_id, reportType, provider = 'openai') {
        const context = await this.gatherSystemContext(org_id);
        const prompts = {
            executive: 'Generate a comprehensive executive summary report covering projects, financials, goals, and team performance.',
            financial: 'Generate a detailed financial analysis including revenue, expenses, profitability trends, and recommendations.',
            project: 'Generate a project status report covering all active projects, completion rates, and blockers.',
            sprint: 'Generate a sprint analysis report covering velocity, completion rates, and team performance.',
            goals: 'Generate a goals and OKRs progress report with risk analysis and recommendations.',
        };
        const prompt = prompts[reportType] || 'Generate a comprehensive status report of the entire system.';
        return this.chat(org_id, 'system', prompt, provider);
    }
    async analyzeRisk(org_id, provider = 'openai') {
        const context = await this.gatherSystemContext(org_id);
        const prompt = `Analyze all current data and identify:
1. Projects at risk of delay
2. Financial concerns or budget overruns
3. Goals that might not be achieved
4. Critical bugs that need immediate attention
5. Team capacity or productivity issues

Provide specific, actionable recommendations for each risk identified.`;
        return this.chat(org_id, 'system', prompt, provider);
    }
    async suggestPriorities(org_id, provider = 'openai') {
        const context = await this.gatherSystemContext(org_id);
        const prompt = `Based on all current data, suggest:
1. Top 5 tasks that should be prioritized
2. Critical bugs that need immediate attention
3. Goals that need more focus
4. Projects that need additional resources
5. Team members who might need support

Explain your reasoning for each suggestion.`;
        return this.chat(org_id, 'system', prompt, provider);
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(3, (0, typeorm_1.InjectRepository)(bug_entity_1.Bug)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(6, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __param(7, (0, typeorm_1.InjectRepository)(goal_entity_1.Goal)),
    __param(8, (0, typeorm_1.InjectRepository)(kpi_entity_1.KPI)),
    __param(9, (0, typeorm_1.InjectRepository)(meeting_entity_1.Meeting)),
    __param(10, (0, typeorm_1.InjectRepository)(sprint_entity_1.Sprint)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AiService);
//# sourceMappingURL=ai.service.js.map