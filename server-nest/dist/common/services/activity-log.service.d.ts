import { Repository } from 'typeorm';
import { ActivityEvent } from '../../entities/activity-event.entity';
import { AuditLog } from '../../entities/audit-log.entity';
export type ActivityLogInput = {
    org_id: string;
    actor?: any;
    action: string;
    resource_type: string;
    resource_id: string;
    summary: string;
    changes?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    metadata?: Record<string, any>;
};
export declare const VALUABLE_ACTIVITY_TYPES: Set<string>;
export declare class ActivityLogService {
    private readonly activityRepository;
    private readonly auditRepository;
    constructor(activityRepository: Repository<ActivityEvent>, auditRepository: Repository<AuditLog>);
    private actorName;
    log(input: ActivityLogInput): Promise<ActivityEvent>;
    listForActor(org_id: string, actor_id: string, take?: number): Promise<ActivityEvent[]>;
}
