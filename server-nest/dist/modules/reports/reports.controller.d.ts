import { ReportsService } from './reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    create(user: any, createDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Report[];
    }>;
    findAll(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Report[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Report;
    }>;
    update(user: any, id: string, updateDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Report;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    generateProjectReport(user: any, project_id?: string): Promise<{
        success: boolean;
        data: {
            project: import("../../entities").Project;
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
    generateFinancialReport(user: any, start_date?: string, end_date?: string): Promise<{
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
    generateKPIReport(user: any): Promise<{
        success: boolean;
        data: {
            total_kpis: number;
            by_category: {};
            overall_achievement: number;
        };
    }>;
    generateTaskReport(user: any, user_id?: string, start_date?: string, end_date?: string): Promise<{
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
    generateBugReport(user: any, start_date?: string, end_date?: string): Promise<{
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
