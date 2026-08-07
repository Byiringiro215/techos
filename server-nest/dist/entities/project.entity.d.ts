import { Organization } from './organization.entity';
import { Sprint } from './sprint.entity';
import { Task } from './task.entity';
export declare class Project {
    id: string;
    org_id: string;
    name: string;
    description: string;
    status: string;
    priority: string;
    start_date: string;
    end_date: string;
    budget: number;
    created_by: string;
    visible_to_roles: string[] | null;
    metadata: any;
    created_at: Date;
    organization: Organization;
    sprints: Sprint[];
    tasks: Task[];
}
