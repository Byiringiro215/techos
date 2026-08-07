import { Project } from './project.entity';
import { Sprint } from './sprint.entity';
export declare class Task {
    id: string;
    org_id: string;
    project_id: string;
    sprint_id: string;
    parent_task_id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee_id: string;
    assignee_ids: string[];
    reporter_id: string;
    estimated_hours: number;
    time_logged: number;
    story_points: number;
    due_date: string;
    dependencies: string[];
    tags: string[];
    created_at: Date;
    project: Project;
    sprint: Sprint;
}
