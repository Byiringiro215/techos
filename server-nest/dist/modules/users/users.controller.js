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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const users_service_1 = require("./users.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const create_user_by_ceo_dto_1 = require("./dto/create-user-by-ceo.dto");
const update_my_profile_dto_1 = require("./dto/update-my-profile.dto");
const update_my_password_dto_1 = require("./dto/update-my-password.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll(user) {
        return this.usersService.findAll(user.org_id);
    }
    createByCeo(user, dto) {
        return this.usersService.createByCeo(user.org_id, user, dto);
    }
    updateMyProfile(user, dto) {
        return this.usersService.updateMyProfile(user.org_id, user.id, dto);
    }
    updateMyPassword(user, dto) {
        return this.usersService.updateMyPassword(user.org_id, user.id, dto.currentPassword, dto.newPassword);
    }
    findOne(user, id) {
        return this.usersService.findOne(id, user.org_id);
    }
    update(user, id, updateData) {
        return this.usersService.update(id, user.org_id, user, updateData);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_by_ceo_dto_1.CreateUserByCeoDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createByCeo", null);
__decorate([
    (0, common_1.Put)('me/profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_my_profile_dto_1.UpdateMyProfileDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Put)('me/password'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_my_password_dto_1.UpdateMyPasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMyPassword", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map