import { Repository } from 'typeorm';
import { Goal } from '../../entities/goal.entity';
import { User } from '../../entities/user.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ActivityLogService } from '../../common/services/activity-log.service';
export declare class GoalsService {
    private goalRepository;
    private usersRepository;
    private activityLogService;
    constructor(goalRepository: Repository<Goal>, usersRepository: Repository<User>, activityLogService: ActivityLogService);
    create(org_id: string, createDto: CreateGoalDto, actor?: any): Promise<{
        success: boolean;
        data: Goal;
    }>;
    private withOwnerNames;
    findAll(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: {
            owner_name: string;
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
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: {
            child_goals: Goal[];
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
    update(id: string, org_id: string, updateDto: UpdateGoalDto, actor?: any): Promise<{
        success: boolean;
        data: Goal;
    }>;
    remove(id: string, org_id: string, actor?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    updateKeyResult(id: string, org_id: string, keyResultIndex: number, current: number): Promise<{
        success: boolean;
        data: Goal;
    }>;
    getAlignment(org_id: string): Promise<{
        success: boolean;
        data: {
            department_goals: {
                team_goals: Goal[];
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
    getProgressReport(org_id: string, quarter?: string): Promise<{
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
    getKeyResults(goal_id: string, org_id: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    createKeyResult(org_id: string, createDto: any): Promise<{
        success: boolean;
        data: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            title: any;
            target: number;
            current: number;
            unit: any;
        };
    }>;
    updateKeyResultById(org_id: string, key_result_id: string, updateDto: any): Promise<{
        success: boolean;
        data: any;
    }>;
    deleteKeyResultById(org_id: string, key_result_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
