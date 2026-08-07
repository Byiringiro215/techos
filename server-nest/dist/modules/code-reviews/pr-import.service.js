"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrImportService = void 0;
const common_1 = require("@nestjs/common");
let PrImportService = PrImportService_1 = class PrImportService {
    logger = new common_1.Logger(PrImportService_1.name);
    parseGithubPrUrl(url) {
        const match = String(url || '').match(/github\.com[/:]([^/]+)\/([^/#]+?)(?:\.git)?\/pull\/(\d+)/i);
        if (!match)
            return null;
        return { owner: match[1], repo: match[2].replace(/\.git$/i, ''), number: match[3] };
    }
    parseGitlabMrUrl(url) {
        const match = String(url || '').match(/https?:\/\/([^/]+)\/(.+?)\/-\/merge_requests\/(\d+)/i);
        if (!match)
            return null;
        return { host: match[1], projectPath: match[2], number: match[3] };
    }
    async importFiles(prUrl, tokens) {
        const github = this.parseGithubPrUrl(prUrl);
        if (github) {
            return this.fetchGithubFiles(github, tokens?.github || process.env.GITHUB_TOKEN);
        }
        const gitlab = this.parseGitlabMrUrl(prUrl);
        if (gitlab) {
            return this.fetchGitlabFiles(gitlab, tokens?.gitlab || process.env.GITLAB_TOKEN);
        }
        return {
            files: [],
            provider: null,
            message: 'PR URL must be a GitHub pull request or GitLab merge request link',
        };
    }
    async fetchGithubFiles(ref, token) {
        const url = `https://api.github.com/repos/${ref.owner}/${ref.repo}/pulls/${ref.number}/files`;
        const headers = {
            Accept: 'application/vnd.github+json',
            'User-Agent': 'TechOS',
            'X-GitHub-Api-Version': '2022-11-28',
        };
        if (token)
            headers.Authorization = `Bearer ${token}`;
        try {
            const res = await fetch(url, { headers });
            if (!res.ok) {
                const body = await res.text();
                this.logger.warn(`GitHub PR import failed (${res.status}): ${body.slice(0, 200)}`);
                return {
                    files: [],
                    provider: 'github',
                    message: res.status === 401 || res.status === 403
                        ? 'GitHub rejected the request — set GITHUB_TOKEN or connect GitHub in Integrations'
                        : `GitHub returned ${res.status}. Check the PR URL and token permissions.`,
                };
            }
            const data = (await res.json());
            const files = (Array.isArray(data) ? data : []).map((f) => ({
                path: String(f.filename || f.path || 'unknown'),
                additions: Number(f.additions || 0),
                deletions: Number(f.deletions || 0),
                patch: typeof f.patch === 'string' ? f.patch : undefined,
                status: f.status || 'modified',
            }));
            return { files, provider: 'github' };
        }
        catch (err) {
            this.logger.warn(`GitHub fetch error: ${err?.message || err}`);
            return {
                files: [],
                provider: 'github',
                message: 'Could not reach GitHub API',
            };
        }
    }
    async fetchGitlabFiles(ref, token) {
        const encoded = encodeURIComponent(ref.projectPath);
        const url = `https://${ref.host}/api/v4/projects/${encoded}/merge_requests/${ref.number}/changes`;
        const headers = { 'User-Agent': 'TechOS' };
        if (token)
            headers['PRIVATE-TOKEN'] = token;
        try {
            const res = await fetch(url, { headers });
            if (!res.ok) {
                return {
                    files: [],
                    provider: 'gitlab',
                    message: res.status === 401 || res.status === 403
                        ? 'GitLab rejected the request — set GITLAB_TOKEN or connect GitLab in Integrations'
                        : `GitLab returned ${res.status}`,
                };
            }
            const data = (await res.json());
            const changes = Array.isArray(data?.changes) ? data.changes : [];
            const files = changes.map((c) => {
                const patch = String(c.diff || '');
                const additions = (patch.match(/^\+[^+]/gm) || []).length;
                const deletions = (patch.match(/^-[^-]/gm) || []).length;
                return {
                    path: String(c.new_path || c.old_path || 'unknown'),
                    additions,
                    deletions,
                    patch: patch || undefined,
                    status: c.new_file ? 'added' : c.deleted_file ? 'removed' : 'modified',
                };
            });
            return { files, provider: 'gitlab' };
        }
        catch (err) {
            this.logger.warn(`GitLab fetch error: ${err?.message || err}`);
            return {
                files: [],
                provider: 'gitlab',
                message: 'Could not reach GitLab API',
            };
        }
    }
};
exports.PrImportService = PrImportService;
exports.PrImportService = PrImportService = PrImportService_1 = __decorate([
    (0, common_1.Injectable)()
], PrImportService);
//# sourceMappingURL=pr-import.service.js.map