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
exports.CalendarEvent = void 0;
const typeorm_1 = require("typeorm");
let CalendarEvent = class CalendarEvent {
    id;
    org_id;
    title;
    description;
    start_datetime;
    end_datetime;
    all_day;
    type;
    color;
    recurrence;
    created_by;
    attendees;
    created_at;
};
exports.CalendarEvent = CalendarEvent;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], CalendarEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalendarEvent.prototype, "org_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalendarEvent.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalendarEvent.prototype, "start_datetime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalendarEvent.prototype, "end_datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CalendarEvent.prototype, "all_day", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'event' }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], CalendarEvent.prototype, "recurrence", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalendarEvent.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], CalendarEvent.prototype, "attendees", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "created_at", void 0);
exports.CalendarEvent = CalendarEvent = __decorate([
    (0, typeorm_1.Entity)('calendar_events')
], CalendarEvent);
//# sourceMappingURL=calendar-event.entity.js.map