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
exports.Deal = void 0;
const typeorm_1 = require("typeorm");
let Deal = class Deal {
    id;
    org_id;
    contact_id;
    title;
    value;
    currency;
    stage;
    probability;
    expected_close_date;
    assigned_to;
    notes;
    created_at;
};
exports.Deal = Deal;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], Deal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Deal.prototype, "org_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Deal.prototype, "contact_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Deal.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], Deal.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], Deal.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'qualification' }),
    __metadata("design:type", String)
], Deal.prototype, "stage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Deal.prototype, "probability", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Deal.prototype, "expected_close_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Deal.prototype, "assigned_to", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Deal.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Deal.prototype, "created_at", void 0);
exports.Deal = Deal = __decorate([
    (0, typeorm_1.Entity)('deals')
], Deal);
//# sourceMappingURL=deal.entity.js.map