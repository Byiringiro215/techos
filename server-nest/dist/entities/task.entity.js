"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
const sprint_entity_1 = require("./sprint.entity");
let Task = class Task {
    id;
    org_id;
    project_id;
    sprint_id;
    parent_task_id;
    title;
    description;
    status;
    priority;
    assignee_id;
    reporter_id;
    estimated_hours;
    time_logged;
    story_points;
    due_date;
    dependencies;
    tags;
    created_at;
    project;
    sprint;
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "org_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "project_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "sprint_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "parent_task_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'todo' }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'medium' }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "assignee_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "reporter_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "estimated_hours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "time_logged", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "story_points", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Task.prototype, "dependencies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Task.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.tasks),
    (0, typeorm_1.JoinColumn)({ name: 'project_id' }),
    __metadata("design:type", project_entity_1.Project)
], Task.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sprint_entity_1.Sprint, (sprint) => sprint.tasks, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sprint_id' }),
    __metadata("design:type", sprint_entity_1.Sprint)
], Task.prototype, "sprint", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)('tasks')
], Task);
//# sourceMappingURL=task.entity.js.map