import { Repository } from 'typeorm';
import { Feature } from '../../entities/feature.entity';
import { Epic } from '../../entities/epic.entity';
import { Bug } from '../../entities/bug.entity';
import { Release } from '../../entities/release.entity';
import { CustomerFeedback } from '../../entities/customer-feedback.entity';
import { Roadmap } from '../../entities/roadmap.entity';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
export declare class ProductService {
    private featureRepository;
    private epicRepository;
    private bugRepository;
    private releaseRepository;
    private feedbackRepository;
    private roadmapRepository;
    private projectRepository;
    private userRepository;
    constructor(featureRepository: Repository<Feature>, epicRepository: Repository<Epic>, bugRepository: Repository<Bug>, releaseRepository: Repository<Release>, feedbackRepository: Repository<CustomerFeedback>, roadmapRepository: Repository<Roadmap>, projectRepository: Repository<Project>, userRepository: Repository<User>);
    createFeature(org_id: string, createDto: any): Promise<{
        success: boolean;
        data: Feature[];
    }>;
    findAllFeatures(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Feature[];
    }>;
    findOneFeature(id: string, org_id: string): Promise<{
        success: boolean;
        data: Feature;
    }>;
    updateFeature(id: string, org_id: string, updateDto: any): Promise<{
        success: boolean;
        data: Feature;
    }>;
    removeFeature(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    voteFeature(id: string, org_id: string): Promise<{
        success: boolean;
        data: Feature;
    }>;
    createEpic(org_id: string, createDto: any): Promise<{
        success: boolean;
        data: Epic[];
    }>;
    findAllEpics(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Epic[];
    }>;
    findOneEpic(id: string, org_id: string): Promise<{
        success: boolean;
        data: {
            features: Feature[];
            id: string;
            org_id: string;
            title: string;
            description: string;
            status: string;
            owner_id: string;
            start_date: string;
            end_date: string;
            progress: number;
            created_at: Date;
        };
    }>;
    updateEpic(id: string, org_id: string, updateDto: any): Promise<{
        success: boolean;
        data: Epic;
    }>;
    removeEpic(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createBug(org_id: string, reporter_id: string, createDto: any): Promise<{
        success: boolean;
        data: {
            project_name: string | null;
            assignee_name: string | null;
            reporter_name: string | null;
            id: string;
            org_id: string;
            title: string;
            description: string;
            status: string;
            severity: string;
            priority: string;
            assignee_id: string;
            reporter_id: string;
            project_id: string;
            steps_to_reproduce: string;
            expected_behavior: string;
            actual_behavior: string;
            environment: string;
            created_at: Date;
        };
    }>;
    private enrichBugs;
    private enrichBug;
    findAllBugs(org_id: string, filters?: any, user?: {
        id?: string;
        role?: string;
    }): Promise<{
        success: boolean;
        data: {
            project_name: string | null;
            assignee_name: string | null;
            reporter_name: string | null;
            id: string;
            org_id: string;
            title: string;
            description: string;
            status: string;
            severity: string;
            priority: string;
            assignee_id: string;
            reporter_id: string;
            project_id: string;
            steps_to_reproduce: string;
            expected_behavior: string;
            actual_behavior: string;
            environment: string;
            created_at: Date;
        }[];
    }>;
    findOneBug(id: string, org_id: string): Promise<{
        success: boolean;
        data: {
            project_name: string | null;
            assignee_name: string | null;
            reporter_name: string | null;
            id: string;
            org_id: string;
            title: string;
            description: string;
            status: string;
            severity: string;
            priority: string;
            assignee_id: string;
            reporter_id: string;
            project_id: string;
            steps_to_reproduce: string;
            expected_behavior: string;
            actual_behavior: string;
            environment: string;
            created_at: Date;
        };
    }>;
    updateBug(id: string, org_id: string, updateDto: any): Promise<{
        success: boolean;
        data: Bug;
    }>;
    removeBug(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createRelease(org_id: string, createDto: any): Promise<{
        success: boolean;
        data: Release[];
    }>;
    findAllReleases(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Release[];
    }>;
    findOneRelease(id: string, org_id: string): Promise<{
        success: boolean;
        data: {
            features: Feature[];
            id: string;
            org_id: string;
            version: string;
            name: string;
            description: string;
            status: string;
            release_date: string;
            release_notes: string[];
            created_at: Date;
        };
    }>;
    updateRelease(id: string, org_id: string, updateDto: any): Promise<{
        success: boolean;
        data: Release;
    }>;
    removeRelease(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createFeedback(org_id: string, createDto: any): Promise<{
        success: boolean;
        data: CustomerFeedback[];
    }>;
    findAllFeedback(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: CustomerFeedback[];
    }>;
    findOneFeedback(id: string, org_id: string): Promise<{
        success: boolean;
        data: CustomerFeedback;
    }>;
    updateFeedback(id: string, org_id: string, updateDto: any): Promise<{
        success: boolean;
        data: CustomerFeedback;
    }>;
    removeFeedback(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createRoadmap(org_id: string, createDto: any): Promise<{
        success: boolean;
        data: Roadmap[];
    }>;
    findAllRoadmaps(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Roadmap[];
    }>;
    findOneRoadmap(id: string, org_id: string): Promise<{
        success: boolean;
        data: Roadmap;
    }>;
    updateRoadmap(id: string, org_id: string, updateDto: any): Promise<{
        success: boolean;
        data: Roadmap;
    }>;
    removeRoadmap(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
