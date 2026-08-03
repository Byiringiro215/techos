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
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const integration_entity_1 = require("../../entities/integration.entity");
let IntegrationsService = class IntegrationsService {
    integrationRepository;
    constructor(integrationRepository) {
        this.integrationRepository = integrationRepository;
    }
    async create(org_id, createDto) {
        const existing = await this.integrationRepository.findOne({
            where: { org_id, type: createDto.type },
        });
        if (existing) {
            throw new common_1.BadRequestException('Integration already exists for this type');
        }
        const integration = this.integrationRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createDto,
            enabled: true,
        });
        await this.integrationRepository.save(integration);
        return { success: true, data: integration };
    }
    async findAll(org_id, filters) {
        const query = this.integrationRepository.createQueryBuilder('integration')
            .where('integration.org_id = :org_id', { org_id });
        if (filters?.type) {
            query.andWhere('integration.type = :type', { type: filters.type });
        }
        if (filters?.enabled !== undefined) {
            query.andWhere('integration.enabled = :enabled', { enabled: filters.enabled });
        }
        query.orderBy('integration.created_at', 'DESC');
        const integrations = await query.getMany();
        return { success: true, data: integrations };
    }
    async findOne(id, org_id) {
        const integration = await this.integrationRepository.findOne({
            where: { id, org_id },
        });
        if (!integration) {
            throw new common_1.NotFoundException('Integration not found');
        }
        return { success: true, data: integration };
    }
    async findByType(org_id, type) {
        const integration = await this.integrationRepository.findOne({
            where: { org_id, type },
        });
        return integration;
    }
    async update(id, org_id, updateDto) {
        const integration = await this.integrationRepository.findOne({
            where: { id, org_id },
        });
        if (!integration) {
            throw new common_1.NotFoundException('Integration not found');
        }
        Object.assign(integration, updateDto);
        await this.integrationRepository.save(integration);
        return { success: true, data: integration };
    }
    async remove(id, org_id) {
        const integration = await this.integrationRepository.findOne({
            where: { id, org_id },
        });
        if (!integration) {
            throw new common_1.NotFoundException('Integration not found');
        }
        await this.integrationRepository.remove(integration);
        return { success: true, message: 'Integration deleted successfully' };
    }
    async toggleEnabled(id, org_id) {
        const integration = await this.integrationRepository.findOne({
            where: { id, org_id },
        });
        if (!integration) {
            throw new common_1.NotFoundException('Integration not found');
        }
        integration.enabled = !integration.enabled;
        await this.integrationRepository.save(integration);
        return { success: true, data: integration };
    }
    async saveOAuthTokens(org_id, type, tokens) {
        let integration = await this.findByType(org_id, type);
        if (!integration) {
            integration = this.integrationRepository.create({
                id: (0, crypto_1.randomUUID)(),
                org_id,
                type,
                name: type,
                enabled: true,
                config: {},
            });
        }
        integration.access_token = tokens.access_token;
        integration.refresh_token = tokens.refresh_token;
        integration.expires_at = tokens.expires_at;
        await this.integrationRepository.save(integration);
        return { success: true, data: integration };
    }
    async getOAuthTokens(org_id, type) {
        const integration = await this.findByType(org_id, type);
        if (!integration) {
            throw new common_1.NotFoundException(`${type} integration not found`);
        }
        if (!integration.enabled) {
            throw new common_1.BadRequestException(`${type} integration is disabled`);
        }
        return {
            access_token: integration.access_token,
            refresh_token: integration.refresh_token,
            expires_at: integration.expires_at,
        };
    }
    async handleGitHubWebhook(org_id, payload) {
        return { success: true, message: 'GitHub webhook processed' };
    }
    async handleGitLabWebhook(org_id, payload) {
        return { success: true, message: 'GitLab webhook processed' };
    }
    async handleStripeWebhook(payload) {
        return { success: true, message: 'Stripe webhook processed' };
    }
    async handleSlackWebhook(org_id, payload) {
        return { success: true, message: 'Slack webhook processed' };
    }
    async syncGitHubIssues(org_id, repo) {
        const integration = await this.findByType(org_id, 'github');
        if (!integration || !integration.enabled) {
            throw new common_1.BadRequestException('GitHub integration not configured');
        }
        return {
            success: true,
            message: 'GitHub issues sync initiated',
            note: 'Implementation requires GitHub API client'
        };
    }
    async syncGoogleCalendar(org_id) {
        const integration = await this.findByType(org_id, 'google_calendar');
        if (!integration || !integration.enabled) {
            throw new common_1.BadRequestException('Google Calendar integration not configured');
        }
        return {
            success: true,
            message: 'Google Calendar sync initiated',
            note: 'Implementation requires Google Calendar API client'
        };
    }
    async sendSlackNotification(org_id, channel, message) {
        const integration = await this.findByType(org_id, 'slack');
        if (!integration || !integration.enabled) {
            throw new common_1.BadRequestException('Slack integration not configured');
        }
        return {
            success: true,
            message: 'Slack notification sent',
            note: 'Implementation requires Slack API client'
        };
    }
    async getAvailableIntegrations() {
        return {
            success: true,
            data: [
                { type: 'github', name: 'GitHub', description: 'Sync repositories, issues, and commits' },
                { type: 'gitlab', name: 'GitLab', description: 'Sync projects, issues, and merge requests' },
                { type: 'google_calendar', name: 'Google Calendar', description: 'Sync meetings and events' },
                { type: 'microsoft_outlook', name: 'Microsoft Outlook', description: 'Sync calendar and emails' },
                { type: 'zoom', name: 'Zoom', description: 'Create and manage meetings' },
                { type: 'google_meet', name: 'Google Meet', description: 'Create and manage meetings' },
                { type: 'slack', name: 'Slack', description: 'Send notifications and messages' },
                { type: 'discord', name: 'Discord', description: 'Send notifications and messages' },
                { type: 'stripe', name: 'Stripe', description: 'Process payments and subscriptions' },
                { type: 'quickbooks', name: 'QuickBooks', description: 'Sync financial data' },
                { type: 'google_drive', name: 'Google Drive', description: 'Store and sync files' },
                { type: 'dropbox', name: 'Dropbox', description: 'Store and sync files' },
            ],
        };
    }
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(integration_entity_1.Integration)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map