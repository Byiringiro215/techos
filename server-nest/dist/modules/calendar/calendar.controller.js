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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const calendar_service_1 = require("./calendar.service");
const create_event_dto_1 = require("./dto/create-event.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CalendarController = class CalendarController {
    calendarService;
    constructor(calendarService) {
        this.calendarService = calendarService;
    }
    create(user, createEventDto) {
        return this.calendarService.create(user.org_id, user.id, createEventDto);
    }
    findAll(user, start_date, end_date, type) {
        return this.calendarService.findAll(user.org_id, start_date, end_date, type);
    }
    getUserEvents(user, start_date, end_date) {
        return this.calendarService.getUserEvents(user.org_id, user.id, start_date, end_date);
    }
    findOne(user, id) {
        return this.calendarService.findOne(id, user.org_id);
    }
    update(user, id, updateData) {
        return this.calendarService.update(id, user.org_id, updateData);
    }
    remove(user, id) {
        return this.calendarService.remove(id, user.org_id);
    }
};
exports.CalendarController = CalendarController;
__decorate([
    (0, common_1.Post)('events'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_event_dto_1.CreateEventDto]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('events'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('start_date')),
    __param(2, (0, common_1.Query)('end_date')),
    __param(3, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('events/my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('start_date')),
    __param(2, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "getUserEvents", null);
__decorate([
    (0, common_1.Get)('events/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('events/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('events/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "remove", null);
exports.CalendarController = CalendarController = __decorate([
    (0, common_1.Controller)('calendar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService])
], CalendarController);
//# sourceMappingURL=calendar.controller.js.map