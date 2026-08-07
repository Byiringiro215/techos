"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeReviewsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const code_review_entity_1 = require("../../entities/code-review.entity");
const user_entity_1 = require("../../entities/user.entity");
const project_entity_1 = require("../../entities/project.entity");
const integration_entity_1 = require("../../entities/integration.entity");
const code_reviews_controller_1 = require("./code-reviews.controller");
const code_reviews_service_1 = require("./code-reviews.service");
const pr_import_service_1 = require("./pr-import.service");
const notifications_module_1 = require("../notifications/notifications.module");
const common_module_1 = require("../../common/common.module");
let CodeReviewsModule = class CodeReviewsModule {
};
exports.CodeReviewsModule = CodeReviewsModule;
exports.CodeReviewsModule = CodeReviewsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([code_review_entity_1.CodeReview, user_entity_1.User, project_entity_1.Project, integration_entity_1.Integration]),
            notifications_module_1.NotificationsModule,
            common_module_1.CommonModule,
        ],
        controllers: [code_reviews_controller_1.CodeReviewsController],
        providers: [code_reviews_service_1.CodeReviewsService, pr_import_service_1.PrImportService],
        exports: [code_reviews_service_1.CodeReviewsService],
    })
], CodeReviewsModule);
//# sourceMappingURL=code-reviews.module.js.map