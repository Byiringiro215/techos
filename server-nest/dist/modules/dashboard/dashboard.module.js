"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
const project_entity_1 = require("../../entities/project.entity");
const task_entity_1 = require("../../entities/task.entity");
const sprint_entity_1 = require("../../entities/sprint.entity");
const bug_entity_1 = require("../../entities/bug.entity");
const goal_entity_1 = require("../../entities/goal.entity");
const meeting_entity_1 = require("../../entities/meeting.entity");
const notification_entity_1 = require("../../entities/notification.entity");
const announcement_entity_1 = require("../../entities/announcement.entity");
const invoice_entity_1 = require("../../entities/invoice.entity");
const expense_entity_1 = require("../../entities/expense.entity");
const leave_request_entity_1 = require("../../entities/leave-request.entity");
const report_entity_1 = require("../../entities/report.entity");
const user_entity_1 = require("../../entities/user.entity");
const project_audit_entity_1 = require("../../entities/project-audit.entity");
const audit_task_entity_1 = require("../../entities/audit-task.entity");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                project_entity_1.Project,
                task_entity_1.Task,
                sprint_entity_1.Sprint,
                bug_entity_1.Bug,
                goal_entity_1.Goal,
                meeting_entity_1.Meeting,
                notification_entity_1.Notification,
                announcement_entity_1.Announcement,
                invoice_entity_1.Invoice,
                expense_entity_1.Expense,
                leave_request_entity_1.LeaveRequest,
                report_entity_1.Report,
                user_entity_1.User,
                project_audit_entity_1.ProjectAudit,
                audit_task_entity_1.AuditTask,
            ]),
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
        exports: [dashboard_service_1.DashboardService],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map