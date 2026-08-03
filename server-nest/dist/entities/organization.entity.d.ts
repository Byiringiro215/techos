import { User } from './user.entity';
import { Project } from './project.entity';
export declare class Organization {
    id: string;
    name: string;
    slug: string;
    logo: string;
    plan: string;
    vision: string;
    mission: string;
    settings: any;
    created_at: Date;
    users: User[];
    projects: Project[];
}
