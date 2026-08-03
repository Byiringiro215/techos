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
exports.Goal = void 0;
const typeorm_1 = require("typeorm");
let Goal = class Goal {
    id;
    org_id;
    title;
    description;
    type;
    status;
    progress;
    owner_id;
    parent_goal_id;
    due_date;
    key_results;
    quarter;
    created_at;
};
exports.Goal = Goal;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], Goal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Goal.prototype, "org_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Goal.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Goal.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'company' }),
    __metadata("design:type", String)
], Goal.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], Goal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', default: 0 }),
    __metadata("design:type", Number)
], Goal.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Goal.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Goal.prototype, "parent_goal_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Goal.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Goal.prototype, "key_results", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Goal.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Goal.prototype, "created_at", void 0);
exports.Goal = Goal = __decorate([
    (0, typeorm_1.Entity)('goals')
], Goal);
//# sourceMappingURL=goal.entity.js.map