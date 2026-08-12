"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CisoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const task_entity_1 = require("../../entities/task.entity");
const project_entity_1 = require("../../entities/project.entity");
const report_entity_1 = require("../../entities/report.entity");
const ciso_controller_1 = require("./ciso.controller");
const ciso_service_1 = require("./ciso.service");
let CisoModule = class CisoModule {
};
exports.CisoModule = CisoModule;
exports.CisoModule = CisoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task, project_entity_1.Project, report_entity_1.Report])],
        controllers: [ciso_controller_1.CisoController],
        providers: [ciso_service_1.CisoService],
        exports: [ciso_service_1.CisoService],
    })
], CisoModule);
//# sourceMappingURL=ciso.module.js.map