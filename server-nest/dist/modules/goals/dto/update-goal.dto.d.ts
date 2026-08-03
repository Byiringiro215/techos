export declare class UpdateGoalDto {
    title?: string;
    description?: string;
    status?: string;
    progress?: number;
    owner_id?: string;
    due_date?: string;
    key_results?: Array<{
        title: string;
        target: number;
        current: number;
        unit: string;
    }>;
}
