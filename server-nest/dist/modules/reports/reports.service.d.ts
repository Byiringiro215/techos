import { Repository } from 'typeorm';
import { Report } from '../../entities/report.entity';
import { Project } from '../../entities/project.entity';
import { Task } from '../../entities/task.entity';
import { Bug } from '../../entities/bug.entity';
import { Invoice } from '../../entities/invoice.entity';
import { Expense } from '../../entities/expense.entity';
import { KPI } from '../../entities/kpi.entity';
export declare class ReportsService {
    private reportRepository;
    private projectRepository;
    private taskRepository;
    private bugRepository;
    private invoiceRepository;
    private expenseRepository;
    private kpiRepository;
    constructor(reportRepository: Repository<Report>, projectRepository: Repository<Project>, taskRepository: Repository<Task>, bugRepository: Repository<Bug>, invoiceRepository: Repository<Invoice>, expenseRepository: Repository<Expense>, kpiRepository: Repository<KPI>);
    createReport(org_id: string, created_by: string, createDto: any): Promise<{
        success: boolean;
        data: Report[];
    }>;
    findAll(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Report[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: Report;
    }>;
    updateReport(id: string, org_id: string, updateDto: any): Promise<{
        success: boolean;
        data: Report;
    }>;
    removeReport(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    generateProjectReport(org_id: string, project_id?: string): Promise<{
        success: boolean;
        data: {
            project: Project;
            tasks: {
                total: number;
                completed: number;
                in_progress: number;
                pending: number;
            };
            bugs: {
                total: number;
                open: number;
                resolved: number;
            };
        }[];
    }>;
    generateFinancialReport(org_id: string, start_date?: string, end_date?: string): Promise<{
        success: boolean;
        data: {
            period: {
                start_date: string | undefined;
                end_date: string | undefined;
            };
            revenue: {
                total: number;
                by_status: {
                    paid: number;
                    pending: number;
                    overdue: number;
                };
            };
            expenses: {
                total: number;
                by_category: {};
                by_status: {
                    approved: number;
                    pending: number;
                    rejected: number;
                };
            };
            net_profit: number;
        };
    }>;
    generateKPIReport(org_id: string): Promise<{
        success: boolean;
        data: {
            total_kpis: number;
            by_category: {};
            overall_achievement: number;
        };
    }>;
    generateTaskReport(org_id: string, user_id?: string, start_date?: string, end_date?: string): Promise<{
        success: boolean;
        data: {
            total_tasks: number;
            by_status: {
                todo: number;
                in_progress: number;
                done: number;
            };
            by_priority: {
                high: number;
                medium: number;
                low: number;
            };
            time_tracking: {
                total_estimated: number;
                total_logged: number;
            };
            completion_rate: number;
        };
    }>;
    generateBugReport(org_id: string, start_date?: string, end_date?: string): Promise<{
        success: boolean;
        data: {
            total_bugs: number;
            by_status: {
                open: number;
                in_progress: number;
                resolved: number;
                closed: number;
            };
            by_severity: {
                critical: number;
                high: number;
                medium: number;
                low: number;
            };
            by_priority: {
                high: number;
                medium: number;
                low: number;
            };
            resolution_rate: number;
        };
    }>;
}
