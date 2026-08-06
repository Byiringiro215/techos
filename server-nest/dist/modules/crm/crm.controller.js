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
exports.CrmController = void 0;
const common_1 = require("@nestjs/common");
const crm_service_1 = require("./crm.service");
const create_contact_dto_1 = require("./dto/create-contact.dto");
const create_deal_dto_1 = require("./dto/create-deal.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CrmController = class CrmController {
    crmService;
    constructor(crmService) {
        this.crmService = crmService;
    }
    createContact(user, createContactDto) {
        return this.crmService.createContact(user.org_id, createContactDto);
    }
    findAllContacts(user, filters) {
        return this.crmService.findAllContacts(user.org_id, filters);
    }
    findOneContact(user, id) {
        return this.crmService.findOneContact(id, user.org_id);
    }
    updateContact(user, id, updateData) {
        return this.crmService.updateContact(id, user.org_id, updateData);
    }
    deleteContact(user, id) {
        return this.crmService.deleteContact(id, user.org_id);
    }
    scoreContact(user, id) {
        return this.crmService.scoreContact(id, user.org_id);
    }
    createDeal(user, createDealDto) {
        return this.crmService.createDeal(user.org_id, createDealDto, user);
    }
    findAllDeals(user, filters) {
        return this.crmService.findAllDeals(user.org_id, filters);
    }
    findOneDeal(user, id) {
        return this.crmService.findOneDeal(id, user.org_id);
    }
    updateDeal(user, id, updateData) {
        return this.crmService.updateDeal(id, user.org_id, updateData, user);
    }
    deleteDeal(user, id) {
        return this.crmService.deleteDeal(id, user.org_id, user);
    }
    getPipelineStats(user) {
        return this.crmService.getPipelineStats(user.org_id);
    }
    async getLeadScores(user) {
        const contacts = await this.crmService.findAllContacts(user.org_id);
        const scores = await Promise.all((contacts.data || []).map((contact) => this.crmService.scoreContact(contact.id, user.org_id)));
        return { success: true, data: scores.map((entry) => entry.data) };
    }
    calculateLeadScore(user, contactId) {
        return this.crmService.scoreContact(contactId, user.org_id);
    }
    getPipelines(user) {
        return this.crmService.getPipelineStats(user.org_id);
    }
};
exports.CrmController = CrmController;
__decorate([
    (0, common_1.Post)('contacts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_contact_dto_1.CreateContactDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "createContact", null);
__decorate([
    (0, common_1.Get)('contacts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "findAllContacts", null);
__decorate([
    (0, common_1.Get)('contacts/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "findOneContact", null);
__decorate([
    (0, common_1.Put)('contacts/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Delete)('contacts/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "deleteContact", null);
__decorate([
    (0, common_1.Get)('contacts/:id/score'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "scoreContact", null);
__decorate([
    (0, common_1.Post)('deals'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_deal_dto_1.CreateDealDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "createDeal", null);
__decorate([
    (0, common_1.Get)('deals'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "findAllDeals", null);
__decorate([
    (0, common_1.Get)('deals/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "findOneDeal", null);
__decorate([
    (0, common_1.Put)('deals/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "updateDeal", null);
__decorate([
    (0, common_1.Delete)('deals/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "deleteDeal", null);
__decorate([
    (0, common_1.Get)('pipeline/stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "getPipelineStats", null);
__decorate([
    (0, common_1.Get)('lead-scores'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getLeadScores", null);
__decorate([
    (0, common_1.Post)('lead-scores/:contactId/calculate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('contactId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "calculateLeadScore", null);
__decorate([
    (0, common_1.Get)('pipelines'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "getPipelines", null);
exports.CrmController = CrmController = __decorate([
    (0, common_1.Controller)('crm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [crm_service_1.CrmService])
], CrmController);
//# sourceMappingURL=crm.controller.js.map