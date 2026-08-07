"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const workspace_record_entity_1 = require("../../entities/workspace-record.entity");
const activity_event_entity_1 = require("../../entities/activity-event.entity");
const record_comment_entity_1 = require("../../entities/record-comment.entity");
const workspace_controller_1 = require("./workspace.controller");
const workspace_service_1 = require("./workspace.service");
let WorkspaceModule = class WorkspaceModule {
};
exports.WorkspaceModule = WorkspaceModule;
exports.WorkspaceModule = WorkspaceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([workspace_record_entity_1.WorkspaceRecord, activity_event_entity_1.ActivityEvent, record_comment_entity_1.RecordComment])],
        controllers: [workspace_controller_1.WorkspaceController],
        providers: [workspace_service_1.WorkspaceService],
        exports: [workspace_service_1.WorkspaceService],
    })
], WorkspaceModule);
//# sourceMappingURL=workspace.module.js.map