"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeReview = exports.RecordComment = exports.ActivityEvent = exports.WorkspaceRecord = exports.Report = exports.KPI = exports.Roadmap = exports.AuditLog = exports.Integration = exports.CustomerFeedback = exports.Bug = exports.Release = exports.Epic = exports.Feature = exports.Announcement = exports.Goal = exports.Notification = exports.CalendarEvent = exports.Document = exports.LeaveRequest = exports.Employee = exports.Budget = exports.Expense = exports.Invoice = exports.Deal = exports.Contact = exports.Message = exports.ChannelMember = exports.Channel = exports.MeetingActionItem = exports.MeetingParticipant = exports.Meeting = exports.Task = exports.Sprint = exports.Project = exports.User = exports.Organization = exports.entities = void 0;
const organization_entity_1 = require("./organization.entity");
Object.defineProperty(exports, "Organization", { enumerable: true, get: function () { return organization_entity_1.Organization; } });
const user_entity_1 = require("./user.entity");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_entity_1.User; } });
const project_entity_1 = require("./project.entity");
Object.defineProperty(exports, "Project", { enumerable: true, get: function () { return project_entity_1.Project; } });
const sprint_entity_1 = require("./sprint.entity");
Object.defineProperty(exports, "Sprint", { enumerable: true, get: function () { return sprint_entity_1.Sprint; } });
const task_entity_1 = require("./task.entity");
Object.defineProperty(exports, "Task", { enumerable: true, get: function () { return task_entity_1.Task; } });
const meeting_entity_1 = require("./meeting.entity");
Object.defineProperty(exports, "Meeting", { enumerable: true, get: function () { return meeting_entity_1.Meeting; } });
const meeting_participant_entity_1 = require("./meeting-participant.entity");
Object.defineProperty(exports, "MeetingParticipant", { enumerable: true, get: function () { return meeting_participant_entity_1.MeetingParticipant; } });
const meeting_action_item_entity_1 = require("./meeting-action-item.entity");
Object.defineProperty(exports, "MeetingActionItem", { enumerable: true, get: function () { return meeting_action_item_entity_1.MeetingActionItem; } });
const channel_entity_1 = require("./channel.entity");
Object.defineProperty(exports, "Channel", { enumerable: true, get: function () { return channel_entity_1.Channel; } });
const channel_member_entity_1 = require("./channel-member.entity");
Object.defineProperty(exports, "ChannelMember", { enumerable: true, get: function () { return channel_member_entity_1.ChannelMember; } });
const message_entity_1 = require("./message.entity");
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return message_entity_1.Message; } });
const contact_entity_1 = require("./contact.entity");
Object.defineProperty(exports, "Contact", { enumerable: true, get: function () { return contact_entity_1.Contact; } });
const deal_entity_1 = require("./deal.entity");
Object.defineProperty(exports, "Deal", { enumerable: true, get: function () { return deal_entity_1.Deal; } });
const invoice_entity_1 = require("./invoice.entity");
Object.defineProperty(exports, "Invoice", { enumerable: true, get: function () { return invoice_entity_1.Invoice; } });
const expense_entity_1 = require("./expense.entity");
Object.defineProperty(exports, "Expense", { enumerable: true, get: function () { return expense_entity_1.Expense; } });
const budget_entity_1 = require("./budget.entity");
Object.defineProperty(exports, "Budget", { enumerable: true, get: function () { return budget_entity_1.Budget; } });
const employee_entity_1 = require("./employee.entity");
Object.defineProperty(exports, "Employee", { enumerable: true, get: function () { return employee_entity_1.Employee; } });
const leave_request_entity_1 = require("./leave-request.entity");
Object.defineProperty(exports, "LeaveRequest", { enumerable: true, get: function () { return leave_request_entity_1.LeaveRequest; } });
const document_entity_1 = require("./document.entity");
Object.defineProperty(exports, "Document", { enumerable: true, get: function () { return document_entity_1.Document; } });
const calendar_event_entity_1 = require("./calendar-event.entity");
Object.defineProperty(exports, "CalendarEvent", { enumerable: true, get: function () { return calendar_event_entity_1.CalendarEvent; } });
const notification_entity_1 = require("./notification.entity");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return notification_entity_1.Notification; } });
const goal_entity_1 = require("./goal.entity");
Object.defineProperty(exports, "Goal", { enumerable: true, get: function () { return goal_entity_1.Goal; } });
const announcement_entity_1 = require("./announcement.entity");
Object.defineProperty(exports, "Announcement", { enumerable: true, get: function () { return announcement_entity_1.Announcement; } });
const feature_entity_1 = require("./feature.entity");
Object.defineProperty(exports, "Feature", { enumerable: true, get: function () { return feature_entity_1.Feature; } });
const epic_entity_1 = require("./epic.entity");
Object.defineProperty(exports, "Epic", { enumerable: true, get: function () { return epic_entity_1.Epic; } });
const release_entity_1 = require("./release.entity");
Object.defineProperty(exports, "Release", { enumerable: true, get: function () { return release_entity_1.Release; } });
const bug_entity_1 = require("./bug.entity");
Object.defineProperty(exports, "Bug", { enumerable: true, get: function () { return bug_entity_1.Bug; } });
const customer_feedback_entity_1 = require("./customer-feedback.entity");
Object.defineProperty(exports, "CustomerFeedback", { enumerable: true, get: function () { return customer_feedback_entity_1.CustomerFeedback; } });
const integration_entity_1 = require("./integration.entity");
Object.defineProperty(exports, "Integration", { enumerable: true, get: function () { return integration_entity_1.Integration; } });
const audit_log_entity_1 = require("./audit-log.entity");
Object.defineProperty(exports, "AuditLog", { enumerable: true, get: function () { return audit_log_entity_1.AuditLog; } });
const roadmap_entity_1 = require("./roadmap.entity");
Object.defineProperty(exports, "Roadmap", { enumerable: true, get: function () { return roadmap_entity_1.Roadmap; } });
const kpi_entity_1 = require("./kpi.entity");
Object.defineProperty(exports, "KPI", { enumerable: true, get: function () { return kpi_entity_1.KPI; } });
const report_entity_1 = require("./report.entity");
Object.defineProperty(exports, "Report", { enumerable: true, get: function () { return report_entity_1.Report; } });
const workspace_record_entity_1 = require("./workspace-record.entity");
Object.defineProperty(exports, "WorkspaceRecord", { enumerable: true, get: function () { return workspace_record_entity_1.WorkspaceRecord; } });
const activity_event_entity_1 = require("./activity-event.entity");
Object.defineProperty(exports, "ActivityEvent", { enumerable: true, get: function () { return activity_event_entity_1.ActivityEvent; } });
const record_comment_entity_1 = require("./record-comment.entity");
Object.defineProperty(exports, "RecordComment", { enumerable: true, get: function () { return record_comment_entity_1.RecordComment; } });
const code_review_entity_1 = require("./code-review.entity");
Object.defineProperty(exports, "CodeReview", { enumerable: true, get: function () { return code_review_entity_1.CodeReview; } });
exports.entities = [
    organization_entity_1.Organization,
    user_entity_1.User,
    project_entity_1.Project,
    sprint_entity_1.Sprint,
    task_entity_1.Task,
    meeting_entity_1.Meeting,
    meeting_participant_entity_1.MeetingParticipant,
    meeting_action_item_entity_1.MeetingActionItem,
    channel_entity_1.Channel,
    channel_member_entity_1.ChannelMember,
    message_entity_1.Message,
    contact_entity_1.Contact,
    deal_entity_1.Deal,
    invoice_entity_1.Invoice,
    expense_entity_1.Expense,
    budget_entity_1.Budget,
    employee_entity_1.Employee,
    leave_request_entity_1.LeaveRequest,
    document_entity_1.Document,
    calendar_event_entity_1.CalendarEvent,
    notification_entity_1.Notification,
    goal_entity_1.Goal,
    announcement_entity_1.Announcement,
    feature_entity_1.Feature,
    epic_entity_1.Epic,
    release_entity_1.Release,
    bug_entity_1.Bug,
    customer_feedback_entity_1.CustomerFeedback,
    integration_entity_1.Integration,
    audit_log_entity_1.AuditLog,
    roadmap_entity_1.Roadmap,
    kpi_entity_1.KPI,
    report_entity_1.Report,
    workspace_record_entity_1.WorkspaceRecord,
    activity_event_entity_1.ActivityEvent,
    record_comment_entity_1.RecordComment,
    code_review_entity_1.CodeReview,
];
//# sourceMappingURL=index.js.map