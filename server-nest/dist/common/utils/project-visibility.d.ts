import { Project } from '../../entities/project.entity';
export type ProjectViewer = {
    id?: string;
    role?: string;
} | null | undefined;
export declare function parseProjectVisibleRoles(project: Partial<Project> | any): string[] | null;
export declare function canViewProject(project: Partial<Project> | any, user?: ProjectViewer): boolean;
export declare function assertCanViewProject(project: Partial<Project> | any, user?: ProjectViewer): void;
export declare function filterProjectsByInvite<T extends Partial<Project>>(projects: T[], user?: ProjectViewer): T[];
