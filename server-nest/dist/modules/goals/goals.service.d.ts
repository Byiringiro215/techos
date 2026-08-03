import { Repository } from 'typeorm';
import { Goal } from '../../entities/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
export declare class GoalsService {
    private goalRepository;
    constructor(goalRepository: Repository<Goal>);
    create(org_id: string, createDto: CreateGoalDto): Promise<{
        success: boolean;
        data: Goal;
    }>;
    findAll(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Goal[];
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
    update(id: string, org_id: string, updateDto: UpdateGoalDto): Promise<{
        success: boolean;
        data: Goal;
    }>;
    remove(id: string, org_id: string): Promise<{
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
}
