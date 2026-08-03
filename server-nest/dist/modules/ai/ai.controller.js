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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const ai_service_1 = require("./ai.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    chat(user, message, provider) {
        return this.aiService.chat(user.org_id, user.id, message, provider);
    }
    generateReport(user, type, provider) {
        return this.aiService.generateReport(user.org_id, type, provider);
    }
    analyzeRisk(user, provider) {
        return this.aiService.analyzeRisk(user.org_id, provider);
    }
    suggestPriorities(user, provider) {
        return this.aiService.suggestPriorities(user.org_id, provider);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('chat'),
    (0, swagger_1.ApiOperation)({ summary: 'Chat with AI about your system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI response generated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('message')),
    __param(2, (0, common_1.Body)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "chat", null);
__decorate([
    (0, common_1.Get)('generate-report'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate AI-powered report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report generated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('analyze-risk'),
    (0, swagger_1.ApiOperation)({ summary: 'AI risk analysis across all areas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk analysis completed' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "analyzeRisk", null);
__decorate([
    (0, common_1.Get)('suggest-priorities'),
    (0, swagger_1.ApiOperation)({ summary: 'AI-suggested priorities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Priorities suggested' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "suggestPriorities", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI Assistant'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map