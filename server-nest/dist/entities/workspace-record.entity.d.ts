export declare class WorkspaceRecord {
    id: string;
    org_id: string;
    type: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    owner: string;
    amount: number;
    due_date: string;
    metadata: Record<string, any>;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}
