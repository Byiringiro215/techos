import { Repository } from 'typeorm';
import { Feature } from '../../entities/feature.entity';
import { Epic } from '../../entities/epic.entity';
import { Bug } from '../../entities/bug.entity';
import { Release } from '../../entities/release.entity';
import { CustomerFeedback } from '../../entities/customer-feedback.entity';
import { Roadmap } from '../../entities/roadmap.entity';
export declare class ProductService {
    private featureRepository;
    private epicRepository;
    private bugRepository;
    private releaseRepository;
    private feedbackRepository;
    private roadmapRepository;
    constructor(featureRepository: Repository<Feature>, epicRepository: Repository<Epic>, bugRepository: Repository<Bug>, releaseRepository: Repository<Release>, feedbackRepository: Repository<CustomerFeedback>, roadmapRepository: Repository<Roadmap>);
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
        data: Bug[];
    }>;
    findAllBugs(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: Bug[];
    }>;
    findOneBug(id: string, org_id: string): Promise<{
        success: boolean;
        data: Bug;
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
