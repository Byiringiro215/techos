import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Task } from '../../entities/task.entity';
import { Sprint } from '../../entities/sprint.entity';
import { User } from '../../entities/user.entity';
import { Bug } from '../../entities/bug.entity';
import { KPI } from '../../entities/kpi.entity';
export declare class AnalyticsService {
    private projectRepository;
    private taskRepository;
    private sprintRepository;
    private userRepository;
    private bugRepository;
    private kpiRepository;
    constructor(projectRepository: Repository<Project>, taskRepository: Repository<Task>, sprintRepository: Repository<Sprint>, userRepository: Repository<User>, bugRepository: Repository<Bug>, kpiRepository: Repository<KPI>);
    getProjectAnalytics(org_id: string, project_id?: string): Promise<{
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
    getTeamProductivity(org_id: string, start_date?: string, end_date?: string): Promise<{
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
    getSprintAnalytics(org_id: string, sprint_id?: string): Promise<{
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
    getBugAnalytics(org_id: string): Promise<{
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
    getTimeTracking(org_id: string, user_id?: string, project_id?: string): Promise<{
        success: boolean;
        data: {
            total_estimated_hours: number;
            total_logged_hours: number;
            tasks_with_time_logged: number;
            average_logged_per_task: number;
            efficiency_rate: number;
        };
    }>;
    getOverview(org_id: string): Promise<{
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
    createKPI(org_id: string, owner_id: string, createDto: any): Promise<{
        success: boolean;
        data: KPI;
    }>;
    getAllKPIs(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: KPI[];
    }>;
    updateKPI(id: string, org_id: string, updateDto: any): Promise<{
        success: boolean;
        data: KPI;
    }>;
}
