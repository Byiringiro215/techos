export declare class AuditLog {
    id: string;
    org_id: string;
    user_id: string;
    action: string;
    resource_type: string;
    resource_id: string;
    changes: any;
    ip_address: string;
    user_agent: string;
    created_at: Date;
}
