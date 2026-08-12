"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const meetings_controller_1 = require("./meetings.controller");
const meetings_service_1 = require("./meetings.service");
const meeting_entity_1 = require("../../entities/meeting.entity");
const meeting_participant_entity_1 = require("../../entities/meeting-participant.entity");
const meeting_action_item_entity_1 = require("../../entities/meeting-action-item.entity");
const user_entity_1 = require("../../entities/user.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let MeetingsModule = class MeetingsModule {
};
exports.MeetingsModule = MeetingsModule;
exports.MeetingsModule = MeetingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([meeting_entity_1.Meeting, meeting_participant_entity_1.MeetingParticipant, meeting_action_item_entity_1.MeetingActionItem, user_entity_1.User]), notifications_module_1.NotificationsModule],
        controllers: [meetings_controller_1.MeetingsController],
        providers: [meetings_service_1.MeetingsService],
        exports: [meetings_service_1.MeetingsService],
    })
], MeetingsModule);
//# sourceMappingURL=meetings.module.js.map