import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getOverview(user: any): Promise<{
        success: boolean;
        data: {
            projects: {
                total: number;
                active: number;
                completed: number;
            };
            tasks: {
                total: number;
                todo: number;
                in_progress: number;
                done: number;
            };
            sprints: {
                total: number;
                active: number;
                completed: number;
            };
            bugs: {
                total: number;
                open: number;
                resolved: number;
            };
            team: {
                total_members: number;
                active_members: number;
            };
        };
    }>;
    getProjectAnalytics(user: any, project_id?: string): Promise<{
        success: boolean;
        data: {
            project_id: string;
            project_name: string;
            total_tasks: number;
            completed_tasks: number;
            in_progress_tasks: number;
            pending_tasks: number;
            completion_rate: number;
            estimated_hours: number;
            logged_hours: number;
            efficiency: number;
        } | {
            project_id: string;
            project_name: string;
            total_tasks: number;
            completed_tasks: number;
            in_progress_tasks: number;
            pending_tasks: number;
            completion_rate: number;
            estimated_hours: number;
            logged_hours: number;
            efficiency: number;
        }[];
    }>;
    getTeamProductivity(user: any, start_date?: string, end_date?: string): Promise<{
        success: boolean;
        data: {
            user_id: string;
            user_name: string;
            total_tasks: number;
            completed_tasks: number;
            in_progress_tasks: number;
            completion_rate: number;
            total_logged_hours: number;
        }[];
    }>;
    getSprintAnalytics(user: any, sprint_id?: string): Promise<{
        success: boolean;
        data: {
            sprint_id: string;
            sprint_name: string;
            status: string;
            total_tasks: number;
            completed_tasks: number;
            total_story_points: number;
            completed_story_points: number;
            velocity: number;
            completion_rate: number;
        } | {
            sprint_id: string;
            sprint_name: string;
            status: string;
            total_tasks: number;
            completed_tasks: number;
            total_story_points: number;
            completed_story_points: number;
            velocity: number;
            completion_rate: number;
        }[];
    }>;
    getBugAnalytics(user: any): Promise<{
        success: boolean;
        data: {
            total_bugs: number;
            open_bugs: number;
            in_progress_bugs: number;
            resolved_bugs: number;
            closed_bugs: number;
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
        };
    }>;
    getTimeTracking(user: any, user_id?: string, project_id?: string): Promise<{
        success: boolean;
        data: {
            total_estimated_hours: number;
            total_logged_hours: number;
            tasks_with_time_logged: number;
            average_logged_per_task: number;
            efficiency_rate: number;
        };
    }>;
    createKPI(user: any, createDto: any): Promise<{
        success: boolean;
        data: import("../../entities").KPI[];
    }>;
    getAllKPIs(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").KPI[];
    }>;
    updateKPI(user: any, id: string, updateDto: any): Promise<{
        success: boolean;
        data: import("../../entities").KPI;
    }>;
}
