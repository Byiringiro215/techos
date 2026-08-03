import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
export declare class GoalsController {
    private goalsService;
    constructor(goalsService: GoalsService);
    create(user: any, createDto: CreateGoalDto): Promise<{
        success: boolean;
        data: import("../../entities").Goal;
    }>;
    findAll(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Goal[];
    }>;
    getAlignment(user: any): Promise<{
        success: boolean;
        data: {
            department_goals: {
                team_goals: import("../../entities").Goal[];
                id: string;
                org_id: string;
                title: string;
                description: string;
                type: string;
                status: string;
                progress: number;
                owner_id: string;
                parent_goal_id: string;
                due_date: string;
                key_results: any[];
                quarter: string;
                created_at: Date;
            }[];
            id: string;
            org_id: string;
            title: string;
            description: string;
            type: string;
            status: string;
            progress: number;
            owner_id: string;
            parent_goal_id: string;
            due_date: string;
            key_results: any[];
            quarter: string;
            created_at: Date;
        }[];
    }>;
    getProgressReport(user: any, quarter?: string): Promise<{
        success: boolean;
        data: {
            total_goals: number;
            by_type: {
                company: number;
                department: number;
                team: number;
                individual: number;
            };
            average_progress: number;
            on_track: number;
            at_risk: number;
            off_track: number;
        };
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: {
            child_goals: import("../../entities").Goal[];
            id: string;
            org_id: string;
            title: string;
            description: string;
            type: string;
            status: string;
            progress: number;
            owner_id: string;
            parent_goal_id: string;
            due_date: string;
            key_results: any[];
            quarter: string;
            created_at: Date;
        };
    }>;
    update(user: any, id: string, updateDto: UpdateGoalDto): Promise<{
        success: boolean;
        data: import("../../entities").Goal;
    }>;
    updateKeyResult(user: any, id: string, index: string, current: number): Promise<{
        success: boolean;
        data: import("../../entities").Goal;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
