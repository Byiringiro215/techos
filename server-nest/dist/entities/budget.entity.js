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
exports.Budget = void 0;
const typeorm_1 = require("typeorm");
let Budget = class Budget {
    id;
    org_id;
    name;
    category;
    allocated;
    spent;
    period_start;
    period_end;
    owner_id;
    created_at;
};
exports.Budget = Budget;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], Budget.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Budget.prototype, "org_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Budget.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Budget.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], Budget.prototype, "allocated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', default: 0 }),
    __metadata("design:type", Number)
], Budget.prototype, "spent", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Budget.prototype, "period_start", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Budget.prototype, "period_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Budget.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Budget.prototype, "created_at", void 0);
exports.Budget = Budget = __decorate([
    (0, typeorm_1.Entity)('budgets')
], Budget);
//# sourceMappingURL=budget.entity.js.map