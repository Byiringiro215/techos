"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProjectVisibleRoles = parseProjectVisibleRoles;
exports.canViewProject = canViewProject;
exports.assertCanViewProject = assertCanViewProject;
exports.filterProjectsByInvite = filterProjectsByInvite;
const common_1 = require("@nestjs/common");
function parseProjectVisibleRoles(project) {
    const raw = project?.visible_to_roles;
    if (!raw)
        return null;
    if (Array.isArray(raw)) {
        const roles = raw.filter((r) => typeof r === 'string' && !!r.trim()).map((r) => r.toLowerCase());
        return roles.length ? roles : null;
    }
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) {
                return parsed.filter((r) => typeof r === 'string').map((r) => r.toLowerCase());
            }
        }
        catch {
        }
    }
    return null;
}
function canViewProject(project, user) {
    const role = String(user?.role || '').toLowerCase();
    if (role === 'ceo')
        return true;
    if (user?.id && project?.created_by && user.id === project.created_by)
        return true;
    const visible = parseProjectVisibleRoles(project);
    if (!visible || visible.length === 0)
        return false;
    return Boolean(role && visible.includes(role));
}
function assertCanViewProject(project, user) {
    if (!canViewProject(project, user)) {
        throw new common_1.ForbiddenException('You have not been invited to this project');
    }
}
function filterProjectsByInvite(projects, user) {
    return projects.filter((p) => canViewProject(p, user));
}
//# sourceMappingURL=project-visibility.js.map