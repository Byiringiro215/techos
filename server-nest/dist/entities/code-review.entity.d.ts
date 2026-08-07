export type CodeReviewFile = {
    path: string;
    additions?: number;
    deletions?: number;
    patch?: string;
    status?: string;
};
export declare class CodeReview {
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
    files: CodeReviewFile[] | null;
    metadata: Record<string, any> | null;
    created_at: Date;
    updated_at: Date;
}
