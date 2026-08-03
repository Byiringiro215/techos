import { Repository } from 'typeorm';
import { Invoice } from '../../entities/invoice.entity';
import { Expense } from '../../entities/expense.entity';
import { Budget } from '../../entities/budget.entity';
import { User } from '../../entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../../common/services/email.service';
export declare class FinanceService {
    private invoicesRepository;
    private expensesRepository;
    private budgetsRepository;
    private usersRepository;
    private notificationsService;
    private emailService;
    constructor(invoicesRepository: Repository<Invoice>, expensesRepository: Repository<Expense>, budgetsRepository: Repository<Budget>, usersRepository: Repository<User>, notificationsService: NotificationsService, emailService: EmailService);
    createInvoice(org_id: string, createInvoiceDto: CreateInvoiceDto): Promise<{
        success: boolean;
        data: Invoice;
    }>;
    findAllInvoices(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Invoice[];
    }>;
    findOneInvoice(id: string, org_id: string): Promise<{
        success: boolean;
        data: Invoice;
    }>;
    updateInvoice(id: string, org_id: string, updateData: Partial<Invoice>): Promise<{
        success: boolean;
        data: Invoice;
    }>;
    deleteInvoice(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendInvoice(id: string, org_id: string, recipient_email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createExpense(org_id: string, user_id: string, createExpenseDto: CreateExpenseDto): Promise<{
        success: boolean;
        data: Expense;
    }>;
    findAllExpenses(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Expense[];
    }>;
    findOneExpense(id: string, org_id: string): Promise<{
        success: boolean;
        data: Expense;
    }>;
    updateExpense(id: string, org_id: string, updateData: Partial<Expense>): Promise<{
        success: boolean;
        data: Expense;
    }>;
    approveExpense(id: string, org_id: string, user_id: string, user_role: string): Promise<{
        success: boolean;
        data: Expense;
    }>;
    rejectExpense(id: string, org_id: string, user_id: string, user_role: string, reason?: string): Promise<{
        success: boolean;
        data: Expense;
    }>;
    deleteExpense(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createBudget(org_id: string, user_id: string, createBudgetDto: CreateBudgetDto): Promise<{
        success: boolean;
        data: Budget;
    }>;
    findAllBudgets(org_id: string): Promise<{
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
    findOneBudget(id: string, org_id: string): Promise<{
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
    updateBudget(id: string, org_id: string, updateData: Partial<Budget>): Promise<{
        success: boolean;
        data: Budget;
    }>;
    deleteBudget(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getFinancialSummary(org_id: string, start_date?: string, end_date?: string): Promise<{
        success: boolean;
        data: {
            total_income: number;
            total_expenses: number;
            net_profit: number;
            profit_margin: string | number;
        };
    }>;
    private updateBudgetSpent;
    private notifyFinanceTeam;
}
