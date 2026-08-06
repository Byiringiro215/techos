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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const invoice_entity_1 = require("../../entities/invoice.entity");
const expense_entity_1 = require("../../entities/expense.entity");
const budget_entity_1 = require("../../entities/budget.entity");
const user_entity_1 = require("../../entities/user.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const email_service_1 = require("../../common/services/email.service");
const activity_log_service_1 = require("../../common/services/activity-log.service");
let FinanceService = class FinanceService {
    invoicesRepository;
    expensesRepository;
    budgetsRepository;
    usersRepository;
    notificationsService;
    emailService;
    activityLogService;
    constructor(invoicesRepository, expensesRepository, budgetsRepository, usersRepository, notificationsService, emailService, activityLogService) {
        this.invoicesRepository = invoicesRepository;
        this.expensesRepository = expensesRepository;
        this.budgetsRepository = budgetsRepository;
        this.usersRepository = usersRepository;
        this.notificationsService = notificationsService;
        this.emailService = emailService;
        this.activityLogService = activityLogService;
    }
    async createInvoice(org_id, createInvoiceDto, actor) {
        const amount = Number(createInvoiceDto.amount || 0);
        const tax = Number(createInvoiceDto.tax || 0);
        const total = Number(createInvoiceDto.total ?? amount + tax);
        const today = new Date().toISOString().slice(0, 10);
        const invoice = this.invoicesRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            contact_id: createInvoiceDto.contact_id,
            invoice_number: createInvoiceDto.invoice_number || `INV-${Date.now().toString().slice(-8)}`,
            client_name: createInvoiceDto.client_name || undefined,
            amount,
            tax,
            total,
            due_date: createInvoiceDto.due_date || today,
            issued_date: createInvoiceDto.issued_date || today,
            items: createInvoiceDto.items || [
                {
                    description: createInvoiceDto.description || createInvoiceDto.notes || createInvoiceDto.client_name || 'Service',
                    quantity: 1,
                    unit_price: amount,
                    total: amount,
                },
            ],
            notes: createInvoiceDto.notes || createInvoiceDto.description,
            status: createInvoiceDto.status || 'draft',
        });
        await this.invoicesRepository.save(invoice);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'created',
            resource_type: 'invoices',
            resource_id: invoice.id,
            summary: `created invoice "${invoice.invoice_number}"`,
        });
        return {
            success: true,
            data: invoice,
        };
    }
    async findAllInvoices(org_id, filters) {
        const where = { org_id };
        if (filters?.status) {
            where.status = filters.status;
        }
        const invoices = await this.invoicesRepository.find({
            where,
            order: { created_at: 'DESC' },
        });
        const data = invoices.map((invoice) => ({
            ...invoice,
            client_name: invoice.client_name ||
                invoice.items?.[0]?.description ||
                invoice.notes ||
                null,
            amount: invoice.amount ?? invoice.total ?? 0,
        }));
        return {
            success: true,
            data,
        };
    }
    async findOneInvoice(id, org_id) {
        const invoice = await this.invoicesRepository.findOne({
            where: { id, org_id },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        return {
            success: true,
            data: invoice,
        };
    }
    async updateInvoice(id, org_id, updateData, actor) {
        const invoice = await this.invoicesRepository.findOne({
            where: { id, org_id },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        Object.assign(invoice, updateData);
        await this.invoicesRepository.save(invoice);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'updated',
            resource_type: 'invoices',
            resource_id: invoice.id,
            summary: `updated invoice "${invoice.invoice_number}"`,
            changes: updateData,
        });
        return {
            success: true,
            data: invoice,
        };
    }
    async deleteInvoice(id, org_id) {
        const invoice = await this.invoicesRepository.findOne({
            where: { id, org_id },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        await this.invoicesRepository.remove(invoice);
        return {
            success: true,
            message: 'Invoice deleted successfully',
        };
    }
    async sendInvoice(id, org_id, recipient_email) {
        const invoice = await this.invoicesRepository.findOne({
            where: { id, org_id },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        invoice.status = 'sent';
        await this.invoicesRepository.save(invoice);
        await this.emailService.sendEmail({
            to: recipient_email,
            subject: `Invoice ${invoice.invoice_number}`,
            html: `
        <h1>Invoice ${invoice.invoice_number}</h1>
        <p>Amount: $${invoice.total}</p>
        <p>Due Date: ${invoice.due_date}</p>
        <p>Please review the attached invoice.</p>
      `,
        });
        return {
            success: true,
            message: 'Invoice sent successfully',
        };
    }
    async createExpense(org_id, actor, createExpenseDto) {
        const expense = this.expensesRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createExpenseDto,
            submitted_by: actor?.id,
            status: 'pending',
        });
        await this.expensesRepository.save(expense);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'created',
            resource_type: 'expenses',
            resource_id: expense.id,
            summary: `submitted expense $${expense.amount} (${expense.category || 'general'})`,
        });
        await this.notifyFinanceTeam(org_id, 'New Expense Submitted', `Expense of $${expense.amount} submitted for ${expense.category}`);
        return {
            success: true,
            data: expense,
        };
    }
    async findAllExpenses(org_id, filters) {
        const where = { org_id };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.submitted_by) {
            where.submitted_by = filters.submitted_by;
        }
        if (filters?.category) {
            where.category = filters.category;
        }
        const expenses = await this.expensesRepository.find({
            where,
            order: { created_at: 'DESC' },
        });
        return {
            success: true,
            data: expenses,
        };
    }
    async findOneExpense(id, org_id) {
        const expense = await this.expensesRepository.findOne({
            where: { id, org_id },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return {
            success: true,
            data: expense,
        };
    }
    async updateExpense(id, org_id, updateData) {
        const expense = await this.expensesRepository.findOne({
            where: { id, org_id },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        Object.assign(expense, updateData);
        await this.expensesRepository.save(expense);
        return {
            success: true,
            data: expense,
        };
    }
    async approveExpense(id, org_id, user_id, user_role) {
        if (![user_entity_1.UserRole.CEO, user_entity_1.UserRole.FINANCE].includes(user_role)) {
            throw new common_1.ForbiddenException('You do not have permission to approve expenses');
        }
        const expense = await this.expensesRepository.findOne({
            where: { id, org_id },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        expense.status = 'approved';
        expense.approved_by = user_id;
        await this.expensesRepository.save(expense);
        await this.notificationsService.create(org_id, {
            user_id: expense.submitted_by,
            type: 'expense_approved',
            title: 'Expense Approved',
            message: `Your expense of $${expense.amount} has been approved`,
            send_email: true,
        });
        await this.updateBudgetSpent(org_id, expense.category, expense.amount);
        return {
            success: true,
            data: expense,
        };
    }
    async rejectExpense(id, org_id, user_id, user_role, reason) {
        if (![user_entity_1.UserRole.CEO, user_entity_1.UserRole.FINANCE].includes(user_role)) {
            throw new common_1.ForbiddenException('You do not have permission to reject expenses');
        }
        const expense = await this.expensesRepository.findOne({
            where: { id, org_id },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        expense.status = 'rejected';
        await this.expensesRepository.save(expense);
        await this.notificationsService.create(org_id, {
            user_id: expense.submitted_by,
            type: 'expense_rejected',
            title: 'Expense Rejected',
            message: `Your expense of $${expense.amount} was rejected${reason ? ': ' + reason : ''}`,
            send_email: true,
        });
        return {
            success: true,
            data: expense,
        };
    }
    async deleteExpense(id, org_id) {
        const expense = await this.expensesRepository.findOne({
            where: { id, org_id },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        await this.expensesRepository.remove(expense);
        return {
            success: true,
            message: 'Expense deleted successfully',
        };
    }
    async createBudget(org_id, user_id, createBudgetDto) {
        const budget = this.budgetsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createBudgetDto,
            spent: 0,
            owner_id: user_id,
        });
        await this.budgetsRepository.save(budget);
        return {
            success: true,
            data: budget,
        };
    }
    async findAllBudgets(org_id) {
        const budgets = await this.budgetsRepository.find({
            where: { org_id },
            order: { created_at: 'DESC' },
        });
        const budgetsWithUtilization = budgets.map((budget) => ({
            ...budget,
            utilization: budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0,
            remaining: budget.allocated - budget.spent,
        }));
        return {
            success: true,
            data: budgetsWithUtilization,
        };
    }
    async findOneBudget(id, org_id) {
        const budget = await this.budgetsRepository.findOne({
            where: { id, org_id },
        });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        const utilization = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0;
        return {
            success: true,
            data: {
                ...budget,
                utilization,
                remaining: budget.allocated - budget.spent,
            },
        };
    }
    async updateBudget(id, org_id, updateData) {
        const budget = await this.budgetsRepository.findOne({
            where: { id, org_id },
        });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        Object.assign(budget, updateData);
        await this.budgetsRepository.save(budget);
        return {
            success: true,
            data: budget,
        };
    }
    async deleteBudget(id, org_id) {
        const budget = await this.budgetsRepository.findOne({
            where: { id, org_id },
        });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        await this.budgetsRepository.remove(budget);
        return {
            success: true,
            message: 'Budget deleted successfully',
        };
    }
    async getFinancialSummary(org_id, start_date, end_date) {
        const invoiceQuery = this.invoicesRepository
            .createQueryBuilder('invoice')
            .select('SUM(invoice.total)', 'total')
            .where('invoice.org_id = :org_id', { org_id })
            .andWhere('invoice.status IN (:...statuses)', { statuses: ['paid', 'sent'] });
        if (start_date) {
            invoiceQuery.andWhere('invoice.issued_date >= :start_date', { start_date });
        }
        if (end_date) {
            invoiceQuery.andWhere('invoice.issued_date <= :end_date', { end_date });
        }
        const income = await invoiceQuery.getRawOne();
        const expenseQuery = this.expensesRepository
            .createQueryBuilder('expense')
            .select('SUM(expense.amount)', 'total')
            .where('expense.org_id = :org_id', { org_id })
            .andWhere('expense.status = :status', { status: 'approved' });
        if (start_date) {
            expenseQuery.andWhere('expense.date >= :start_date', { start_date });
        }
        if (end_date) {
            expenseQuery.andWhere('expense.date <= :end_date', { end_date });
        }
        const expenses = await expenseQuery.getRawOne();
        const totalIncome = parseFloat(income.total) || 0;
        const totalExpenses = parseFloat(expenses.total) || 0;
        const netProfit = totalIncome - totalExpenses;
        return {
            success: true,
            data: {
                total_income: totalIncome,
                total_expenses: totalExpenses,
                net_profit: netProfit,
                profit_margin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0,
            },
        };
    }
    async updateBudgetSpent(org_id, category, amount) {
        const budget = await this.budgetsRepository.findOne({
            where: { org_id, category },
        });
        if (budget) {
            budget.spent += amount;
            await this.budgetsRepository.save(budget);
            if (budget.spent > budget.allocated) {
                await this.notifyFinanceTeam(org_id, 'Budget Exceeded', `Budget for ${category} has been exceeded. Allocated: $${budget.allocated}, Spent: $${budget.spent}`);
            }
        }
    }
    async notifyFinanceTeam(org_id, title, message) {
        const financeUsers = await this.usersRepository.find({
            where: { org_id, role: user_entity_1.UserRole.FINANCE },
        });
        for (const user of financeUsers) {
            await this.notificationsService.create(org_id, {
                user_id: user.id,
                type: 'finance_alert',
                title,
                message,
                send_email: true,
            });
        }
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __param(2, (0, typeorm_1.InjectRepository)(budget_entity_1.Budget)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService,
        email_service_1.EmailService,
        activity_log_service_1.ActivityLogService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map