export declare class ActivityEvent {
    id: string;
    org_id: string;
    entity_type: string;
    entity_id: string;
    action: string;
    summary: string;
    actor_id: string;
    actor_name: string;
    metadata: Record<string, any>;
    created_at: Date;
}
