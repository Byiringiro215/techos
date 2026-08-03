import { ProductService } from './product.service';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    createFeature(user: any, createDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Feature[];
    }>;
    findAllFeatures(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Feature[];
    }>;
    findOneFeature(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Feature;
    }>;
    updateFeature(user: any, id: string, updateDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Feature;
    }>;
    voteFeature(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Feature;
    }>;
    removeFeature(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createEpic(user: any, createDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Epic[];
    }>;
    findAllEpics(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Epic[];
    }>;
    findOneEpic(user: any, id: string): Promise<{
        success: boolean;
        data: {
            features: import("../../entities").Feature[];
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
    updateEpic(user: any, id: string, updateDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Epic;
    }>;
    removeEpic(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createBug(user: any, createDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Bug[];
    }>;
    findAllBugs(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Bug[];
    }>;
    findOneBug(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Bug;
    }>;
    updateBug(user: any, id: string, updateDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Bug;
    }>;
    removeBug(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createRelease(user: any, createDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Release[];
    }>;
    findAllReleases(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Release[];
    }>;
    findOneRelease(user: any, id: string): Promise<{
        success: boolean;
        data: {
            features: import("../../entities").Feature[];
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
    updateRelease(user: any, id: string, updateDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Release;
    }>;
    removeRelease(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createFeedback(user: any, createDto: any): Promise<{
        success: boolean;
        data: import("../../entities").CustomerFeedback[];
    }>;
    findAllFeedback(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").CustomerFeedback[];
    }>;
    findOneFeedback(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").CustomerFeedback;
    }>;
    updateFeedback(user: any, id: string, updateDto: any): Promise<{
        success: boolean;
        data: import("../../entities").CustomerFeedback;
    }>;
    removeFeedback(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createRoadmap(user: any, createDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Roadmap[];
    }>;
    findAllRoadmaps(user: any, filters: any): Promise<{
        success: boolean;
        data: import("../../entities").Roadmap[];
    }>;
    findOneRoadmap(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").Roadmap;
    }>;
    updateRoadmap(user: any, id: string, updateDto: any): Promise<{
        success: boolean;
        data: import("../../entities").Roadmap;
    }>;
    removeRoadmap(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
