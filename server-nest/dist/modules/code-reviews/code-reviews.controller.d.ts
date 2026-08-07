import { CodeReviewsService } from './code-reviews.service';
export declare class CodeReviewsController {
    private readonly codeReviewsService;
    constructor(codeReviewsService: CodeReviewsService);
    previewPr(user: any, body: {
        pr_url?: string;
    }): Promise<{
        success: boolean;
        data: {
            files: import("./pr-import.service").ImportedReviewFile[];
            provider: string | null;
            message?: string;
        };
    }>;
    create(user: any, body: any): Promise<{
        success: boolean;
        data: {
            import_note: string | null;
            files: import("../../entities/code-review.entity").CodeReviewFile[];
            author_name: string | null;
            reviewer_name: string | null;
            project_name: string | null;
            owner: string;
            additions: number;
            deletions: number;
            file_count: number;
            id: string;
            org_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            project_id: string | null;
            author_id: string;
            reviewer_id: string | null;
            repository: string | null;
            branch: string | null;
            base_branch: string | null;
            pr_url: string | null;
            metadata: Record<string, any> | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    findAll(user: any, query: any): Promise<{
        success: boolean;
        data: {
            files: import("../../entities/code-review.entity").CodeReviewFile[];
            author_name: string | null;
            reviewer_name: string | null;
            project_name: string | null;
            owner: string;
            additions: number;
            deletions: number;
            file_count: number;
            id: string;
            org_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            project_id: string | null;
            author_id: string;
            reviewer_id: string | null;
            repository: string | null;
            branch: string | null;
            base_branch: string | null;
            pr_url: string | null;
            metadata: Record<string, any> | null;
            created_at: Date;
            updated_at: Date;
        }[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: {
            files: import("../../entities/code-review.entity").CodeReviewFile[];
            author_name: string | null;
            reviewer_name: string | null;
            project_name: string | null;
            owner: string;
            additions: number;
            deletions: number;
            file_count: number;
            id: string;
            org_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            project_id: string | null;
            author_id: string;
            reviewer_id: string | null;
            repository: string | null;
            branch: string | null;
            base_branch: string | null;
            pr_url: string | null;
            metadata: Record<string, any> | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    update(user: any, id: string, body: any): Promise<{
        success: boolean;
        data: {
            files: import("../../entities/code-review.entity").CodeReviewFile[];
            author_name: string | null;
            reviewer_name: string | null;
            project_name: string | null;
            owner: string;
            additions: number;
            deletions: number;
            file_count: number;
            id: string;
            org_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            project_id: string | null;
            author_id: string;
            reviewer_id: string | null;
            repository: string | null;
            branch: string | null;
            base_branch: string | null;
            pr_url: string | null;
            metadata: Record<string, any> | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    decide(user: any, id: string, body: {
        status?: string;
    }): Promise<{
        success: boolean;
        data: {
            files: import("../../entities/code-review.entity").CodeReviewFile[];
            author_name: string | null;
            reviewer_name: string | null;
            project_name: string | null;
            owner: string;
            additions: number;
            deletions: number;
            file_count: number;
            id: string;
            org_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            project_id: string | null;
            author_id: string;
            reviewer_id: string | null;
            repository: string | null;
            branch: string | null;
            base_branch: string | null;
            pr_url: string | null;
            metadata: Record<string, any> | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    sync(user: any, id: string): Promise<{
        success: boolean;
        data: {
            files: import("../../entities/code-review.entity").CodeReviewFile[];
            author_name: string | null;
            reviewer_name: string | null;
            project_name: string | null;
            owner: string;
            additions: number;
            deletions: number;
            file_count: number;
            id: string;
            org_id: string;
            title: string;
            description: string | null;
            status: string;
            priority: string;
            project_id: string | null;
            author_id: string;
            reviewer_id: string | null;
            repository: string | null;
            branch: string | null;
            base_branch: string | null;
            pr_url: string | null;
            metadata: Record<string, any> | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
