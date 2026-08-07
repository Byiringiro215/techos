export type ImportedReviewFile = {
    path: string;
    additions: number;
    deletions: number;
    patch?: string;
    status?: string;
};
export declare class PrImportService {
    private readonly logger;
    parseGithubPrUrl(url: string): {
        owner: string;
        repo: string;
        number: string;
    } | null;
    parseGitlabMrUrl(url: string): {
        projectPath: string;
        number: string;
        host: string;
    } | null;
    importFiles(prUrl: string, tokens?: {
        github?: string | null;
        gitlab?: string | null;
    }): Promise<{
        files: ImportedReviewFile[];
        provider: string | null;
        message?: string;
    }>;
    private fetchGithubFiles;
    private fetchGitlabFiles;
}
