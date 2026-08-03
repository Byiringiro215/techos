import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getDeveloperDashboard(user: any): Promise<{
        success: boolean;
        data: {
            my_tasks: import("../../entities").Task[];
            my_bugs: import("../../entities").Bug[];
            active_sprint: import("../../entities").Sprint | null;
            upcoming_meetings: import("../../entities").Meeting[];
            notifications: import("../../entities").Notification[];
            announcements: import("../../entities").Announcement[];
        };
    }>;
    getExecutiveDashboard(user: any): Promise<{
        success: boolean;
        data: {
            projects: {
                total: number;
                active: number;
            };
            goals: {
                total: number;
                average_progress: number;
            };
            financials: {
                total_revenue: number;
                total_expenses: number;
                net: number;
            };
            team_productivity: {
                total_tasks: number;
                completed: number;
                in_progress: number;
            };
            recent_projects: import("../../entities").Project[];
            company_goals: import("../../entities").Goal[];
            announcements: import("../../entities").Announcement[];
            recent_meetings: import("../../entities").Meeting[];
        };
    }>;
    getProductDashboard(user: any): Promise<{
        success: boolean;
        data: {
            features: import("../../entities").Task[];
            bugs: {
                total: number;
                critical: number;
                high: number;
            };
            upcoming_releases: import("../../entities").Meeting[];
        };
    }>;
    getFinanceDashboard(user: any): Promise<{
        success: boolean;
        data: {
            summary: {
                total_revenue: number;
                total_expenses: number;
                net_profit: number;
            };
            invoices: {
                total: number;
                paid: number;
                pending: number;
                overdue: number;
            };
            expenses: {
                total: number;
                pending_approval: number;
            };
            recent_invoices: import("../../entities").Invoice[];
            recent_expenses: import("../../entities").Expense[];
            expense_by_category: any[];
        };
    }>;
    getHRDashboard(user: any): Promise<{
        success: boolean;
        data: {
            leave_requests: {
                total: number;
                pending: number;
                approved: number;
                rejected: number;
            };
            recent_leave_requests: import("../../entities").LeaveRequest[];
            announcements: import("../../entities").Announcement[];
        };
    }>;
}
