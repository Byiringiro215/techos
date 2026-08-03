export declare class CreateGoalDto {
    title: string;
    description: string;
    type?: string;
    owner_id: string;
    parent_goal_id?: string;
    due_date?: string;
    key_results?: Array<{
        title: string;
        target: number;
        current: number;
        unit: string;
    }>;
    quarter?: string;
}
