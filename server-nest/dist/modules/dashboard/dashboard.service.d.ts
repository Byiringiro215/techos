import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Task } from '../../entities/task.entity';
import { Sprint } from '../../entities/sprint.entity';
import { Bug } from '../../entities/bug.entity';
import { Goal } from '../../entities/goal.entity';
import { Meeting } from '../../entities/meeting.entity';
import { Notification } from '../../entities/notification.entity';
import { Announcement } from '../../entities/announcement.entity';
import { Invoice } from '../../entities/invoice.entity';
import { Expense } from '../../entities/expense.entity';
import { LeaveRequest } from '../../entities/leave-request.entity';
import { Report } from '../../entities/report.entity';
import { User } from '../../entities/user.entity';
export declare class DashboardService {
    private projectRepository;
    private taskRepository;
    private sprintRepository;
    private bugRepository;
    private goalRepository;
    private meetingRepository;
    private notificationRepository;
    private announcementRepository;
    private invoiceRepository;
    private expenseRepository;
    private leaveRequestRepository;
    private reportRepository;
    private usersRepository;
    constructor(projectRepository: Repository<Project>, taskRepository: Repository<Task>, sprintRepository: Repository<Sprint>, bugRepository: Repository<Bug>, goalRepository: Repository<Goal>, meetingRepository: Repository<Meeting>, notificationRepository: Repository<Notification>, announcementRepository: Repository<Announcement>, invoiceRepository: Repository<Invoice>, expenseRepository: Repository<Expense>, leaveRequestRepository: Repository<LeaveRequest>, reportRepository: Repository<Report>, usersRepository: Repository<User>);
    getDeveloperDashboard(user_id: string, org_id: string): Promise<{
        success: boolean;
        data: {
            my_tasks: Task[];
            my_bugs: Bug[];
            active_sprint: Sprint | null;
            upcoming_meetings: Meeting[];
            notifications: Notification[];
            announcements: Announcement[];
        };
    }>;
    getExecutiveDashboard(org_id: string): Promise<{
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
                outstanding: number;
                net: number;
            };
            teamSize: number;
            employees: number;
            team_productivity: {
                total_tasks: number;
                completed: number;
                in_progress: number;
            };
            recent_projects: Project[];
            company_goals: Goal[];
            announcements: Announcement[];
            recent_meetings: Meeting[];
        };
    }>;
    getProductDashboard(org_id: string): Promise<{
        success: boolean;
        data: {
            features: Task[];
            bugs: {
                total: number;
                critical: number;
                high: number;
            };
            upcoming_releases: Meeting[];
        };
    }>;
    getFinanceDashboard(org_id: string): Promise<{
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
            recent_invoices: Invoice[];
            recent_expenses: Expense[];
            expense_by_category: any[];
        };
    }>;
    getHRDashboard(org_id: string): Promise<{
        success: boolean;
        data: {
            leave_requests: {
                total: number;
                pending: number;
                approved: number;
                rejected: number;
            };
            recent_leave_requests: LeaveRequest[];
            announcements: Announcement[];
        };
    }>;
    getCisoDashboard(org_id: string): Promise<{
        success: boolean;
        data: {
            tasks: {
                total: number;
                finished: number;
                not_finished: number;
            };
            audits: {
                total: number;
                needed: number;
                in_progress: number;
                completed: number;
            };
            reports: {
                total: number;
                recent: Report[];
            };
        };
    }>;
}
