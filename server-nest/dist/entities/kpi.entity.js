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
exports.KPI = void 0;
const typeorm_1 = require("typeorm");
let KPI = class KPI {
    id;
    org_id;
    name;
    description;
    target;
    current;
    unit;
    frequency;
    owner_id;
    category;
    created_at;
};
exports.KPI = KPI;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], KPI.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KPI.prototype, "org_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KPI.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KPI.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], KPI.prototype, "target", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', default: 0 }),
    __metadata("design:type", Number)
], KPI.prototype, "current", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KPI.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KPI.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KPI.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KPI.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], KPI.prototype, "created_at", void 0);
exports.KPI = KPI = __decorate([
    (0, typeorm_1.Entity)('kpis')
], KPI);
//# sourceMappingURL=kpi.entity.js.map