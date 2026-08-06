"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cloudinary_service_1 = require("./services/cloudinary.service");
const redis_service_1 = require("./services/redis.service");
const email_service_1 = require("./services/email.service");
const activity_log_service_1 = require("./services/activity-log.service");
const events_gateway_1 = require("./gateways/events.gateway");
const activity_event_entity_1 = require("../entities/activity-event.entity");
const audit_log_entity_1 = require("../entities/audit-log.entity");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([activity_event_entity_1.ActivityEvent, audit_log_entity_1.AuditLog])],
        providers: [cloudinary_service_1.CloudinaryService, redis_service_1.RedisService, email_service_1.EmailService, events_gateway_1.EventsGateway, activity_log_service_1.ActivityLogService],
        exports: [cloudinary_service_1.CloudinaryService, redis_service_1.RedisService, email_service_1.EmailService, events_gateway_1.EventsGateway, activity_log_service_1.ActivityLogService],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map