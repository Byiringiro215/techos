import { Repository } from 'typeorm';
import { Sprint } from '../../entities/sprint.entity';
import { Project } from '../../entities/project.entity';
export declare class SprintsService {
    private sprintsRepository;
    private projectsRepository;
    constructor(sprintsRepository: Repository<Sprint>, projectsRepository: Repository<Project>);
    create(org_id: string, createSprintDto: any): Promise<{
        success: boolean;
        data: Sprint[];
    }>;
    findAll(org_id: string, project_id?: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: string, org_id: string, updateSprintDto: any): Promise<{
        success: boolean;
        data: Sprint | null;
    }>;
    remove(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
