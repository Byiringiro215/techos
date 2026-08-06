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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const create_budget_dto_1 = require("./dto/create-budget.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let FinanceController = class FinanceController {
    financeService;
    constructor(financeService) {
        this.financeService = financeService;
    }
    createInvoice(user, createInvoiceDto) {
        return this.financeService.createInvoice(user.org_id, createInvoiceDto, user);
    }
    findAllInvoices(user, filters) {
        return this.financeService.findAllInvoices(user.org_id, filters);
    }
    findOneInvoice(user, id) {
        return this.financeService.findOneInvoice(id, user.org_id);
    }
    updateInvoice(user, id, updateData) {
        return this.financeService.updateInvoice(id, user.org_id, updateData, user);
    }
    deleteInvoice(user, id) {
        return this.financeService.deleteInvoice(id, user.org_id);
    }
    sendInvoice(user, id, body) {
        return this.financeService.sendInvoice(id, user.org_id, body.recipient_email);
    }
    createExpense(user, createExpenseDto) {
        return this.financeService.createExpense(user.org_id, user, createExpenseDto);
    }
    findAllExpenses(user, filters) {
        return this.financeService.findAllExpenses(user.org_id, filters);
    }
    findOneExpense(user, id) {
        return this.financeService.findOneExpense(id, user.org_id);
    }
    updateExpense(user, id, updateData) {
        return this.financeService.updateExpense(id, user.org_id, updateData);
    }
    deleteExpense(user, id) {
        return this.financeService.deleteExpense(id, user.org_id);
    }
    approveExpense(user, id) {
        return this.financeService.approveExpense(id, user.org_id, user.id, user.role);
    }
    rejectExpense(user, id, body) {
        return this.financeService.rejectExpense(id, user.org_id, user.id, user.role, body.reason);
    }
    createBudget(user, createBudgetDto) {
        return this.financeService.createBudget(user.org_id, user.id, createBudgetDto);
    }
    findAllBudgets(user) {
        return this.financeService.findAllBudgets(user.org_id);
    }
    findOneBudget(user, id) {
        return this.financeService.findOneBudget(id, user.org_id);
    }
    updateBudget(user, id, updateData) {
        return this.financeService.updateBudget(id, user.org_id, updateData);
    }
    deleteBudget(user, id) {
        return this.financeService.deleteBudget(id, user.org_id);
    }
    getFinancialSummary(user, start_date, end_date) {
        return this.financeService.getFinancialSummary(user.org_id, start_date, end_date);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Post)('invoices'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)('invoices'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllInvoices", null);
__decorate([
    (0, common_1.Get)('invoices/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findOneInvoice", null);
__decorate([
    (0, common_1.Put)('invoices/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateInvoice", null);
__decorate([
    (0, common_1.Delete)('invoices/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteInvoice", null);
__decorate([
    (0, common_1.Post)('invoices/:id/send'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "sendInvoice", null);
__decorate([
    (0, common_1.Post)('expenses'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Get)('expenses'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllExpenses", null);
__decorate([
    (0, common_1.Get)('expenses/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findOneExpense", null);
__decorate([
    (0, common_1.Put)('expenses/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Delete)('expenses/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteExpense", null);
__decorate([
    (0, common_1.Post)('expenses/:id/approve'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "approveExpense", null);
__decorate([
    (0, common_1.Post)('expenses/:id/reject'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "rejectExpense", null);
__decorate([
    (0, common_1.Post)('budgets'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_budget_dto_1.CreateBudgetDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createBudget", null);
__decorate([
    (0, common_1.Get)('budgets'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllBudgets", null);
__decorate([
    (0, common_1.Get)('budgets/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findOneBudget", null);
__decorate([
    (0, common_1.Put)('budgets/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateBudget", null);
__decorate([
    (0, common_1.Delete)('budgets/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteBudget", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('start_date')),
    __param(2, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getFinancialSummary", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('finance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map