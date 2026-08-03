"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_controller_1 = require("./product.controller");
const product_service_1 = require("./product.service");
const feature_entity_1 = require("../../entities/feature.entity");
const epic_entity_1 = require("../../entities/epic.entity");
const bug_entity_1 = require("../../entities/bug.entity");
const release_entity_1 = require("../../entities/release.entity");
const customer_feedback_entity_1 = require("../../entities/customer-feedback.entity");
const roadmap_entity_1 = require("../../entities/roadmap.entity");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([feature_entity_1.Feature, epic_entity_1.Epic, bug_entity_1.Bug, release_entity_1.Release, customer_feedback_entity_1.CustomerFeedback, roadmap_entity_1.Roadmap])],
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService],
        exports: [product_service_1.ProductService],
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map