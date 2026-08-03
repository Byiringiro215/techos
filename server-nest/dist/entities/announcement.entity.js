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
exports.Announcement = void 0;
const typeorm_1 = require("typeorm");
let Announcement = class Announcement {
    id;
    org_id;
    title;
    content;
    priority;
    author_id;
    is_pinned;
    created_at;
};
exports.Announcement = Announcement;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], Announcement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Announcement.prototype, "org_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Announcement.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Announcement.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'normal' }),
    __metadata("design:type", String)
], Announcement.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Announcement.prototype, "author_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Announcement.prototype, "is_pinned", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Announcement.prototype, "created_at", void 0);
exports.Announcement = Announcement = __decorate([
    (0, typeorm_1.Entity)('announcements')
], Announcement);
//# sourceMappingURL=announcement.entity.js.map