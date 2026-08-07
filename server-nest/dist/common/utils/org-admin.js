"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrgAdmin = isOrgAdmin;
exports.isDeliveryAdmin = isDeliveryAdmin;
exports.assertOrgAdmin = assertOrgAdmin;
exports.assertDeliveryAdmin = assertDeliveryAdmin;
const common_1 = require("@nestjs/common");
function normalizeRole(role) {
    return String(role || '').toLowerCase();
}
function isOrgAdmin(role) {
    return normalizeRole(role) === 'ceo';
}
function isDeliveryAdmin(role) {
    const r = normalizeRole(role);
    return r === 'ceo' || r === 'cto';
}
function assertOrgAdmin(user, action = 'perform this action') {
    if (!isOrgAdmin(user?.role)) {
        throw new common_1.ForbiddenException(`Only the CEO can ${action}`);
    }
}
function assertDeliveryAdmin(user, action = 'perform this action') {
    if (!isDeliveryAdmin(user?.role)) {
        throw new common_1.ForbiddenException(`Only the CEO or CTO can ${action}`);
    }
}
//# sourceMappingURL=org-admin.js.map