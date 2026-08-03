import { Project } from './project.entity';
import { Task } from './task.entity';
export declare class Sprint {
    id: string;
    org_id: string;
    project_id: string;
    name: string;
    goal: string;
    start_date: string;
    end_date: string;
    status: string;
    created_at: Date;
    project: Project;
    tasks: Task[];
}
