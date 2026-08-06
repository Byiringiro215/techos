import { FinanceService } from './finance.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
export declare class FinanceController {
    private financeService;
    constructor(financeService: FinanceService);
    createInvoice(user: any, createInvoiceDto: CreateInvoiceDto): Promise<{
        success: boolean;
        data: import("../../entities").Invoice;
    }>;
    findAllInvoices(user: any, filters: any): Promise<{
        success: boolean;
        data: {
            client_name: any;
            amount: number;
            id: string;
            org_id: string;
            contact_id: string;
            invoice_number: string;
            tax: number;
            total: number;
            status: string;
            due_date: string;
            issued_date: string;
            items: any[];
            notes: string;
            created_at: Date;
        }[];
    }>;
    findOneInvoice(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Invoice;
    }>;
    updateInvoice(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").Invoice;
    }>;
    deleteInvoice(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendInvoice(user: any, id: string, body: {
        recipient_email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    createExpense(user: any, createExpenseDto: CreateExpenseDto): Promise<{
        success: boolean;
        data: import("../../entities").Expense;
    }>;
    findAllExpenses(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Expense[];
    }>;
    findOneExpense(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Expense;
    }>;
    updateExpense(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").Expense;
    }>;
    deleteExpense(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    approveExpense(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Expense;
    }>;
    rejectExpense(user: any, id: string, body: {
        reason?: string;
    }): Promise<{
        success: boolean;
        data: import("../../entities").Expense;
    }>;
    createBudget(user: any, createBudgetDto: CreateBudgetDto): Promise<{
        success: boolean;
        data: import("../../entities").Budget;
    }>;
    findAllBudgets(user: any): Promise<{
        success: boolean;
        data: {
            utilization: number;
            remaining: number;
            id: string;
            org_id: string;
            name: string;
            category: string;
            allocated: number;
            spent: number;
            period_start: string;
            period_end: string;
            owner_id: string;
            created_at: Date;
        }[];
    }>;
    findOneBudget(user: any, id: string): Promise<{
        success: boolean;
        data: {
            utilization: number;
            remaining: number;
            id: string;
            org_id: string;
            name: string;
            category: string;
            allocated: number;
            spent: number;
            period_start: string;
            period_end: string;
            owner_id: string;
            created_at: Date;
        };
    }>;
    updateBudget(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").Budget;
    }>;
    deleteBudget(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getFinancialSummary(user: any, start_date?: string, end_date?: string): Promise<{
        success: boolean;
        data: {
            total_income: number;
            total_expenses: number;
            net_profit: number;
            profit_margin: string | number;
        };
    }>;
}
