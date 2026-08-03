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
exports.HrController = void 0;
const common_1 = require("@nestjs/common");
const hr_service_1 = require("./hr.service");
const create_employee_dto_1 = require("./dto/create-employee.dto");
const create_leave_request_dto_1 = require("./dto/create-leave-request.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let HrController = class HrController {
    hrService;
    constructor(hrService) {
        this.hrService = hrService;
    }
    createEmployee(user, createEmployeeDto) {
        return this.hrService.createEmployee(user.org_id, createEmployeeDto);
    }
    findAllEmployees(user, filters) {
        return this.hrService.findAllEmployees(user.org_id, filters);
    }
    findOneEmployee(user, id) {
        return this.hrService.findOneEmployee(id, user.org_id);
    }
    updateEmployee(user, id, updateData) {
        return this.hrService.updateEmployee(id, user.org_id, updateData);
    }
    deleteEmployee(user, id) {
        return this.hrService.deleteEmployee(id, user.org_id);
    }
    getDepartments(user) {
        return this.hrService.getDepartments(user.org_id);
    }
    createLeaveRequest(user, createLeaveRequestDto) {
        return this.hrService.createLeaveRequest(user.org_id, user.id, createLeaveRequestDto);
    }
    findAllLeaveRequests(user, filters) {
        return this.hrService.findAllLeaveRequests(user.org_id, filters);
    }
    findOneLeaveRequest(user, id) {
        return this.hrService.findOneLeaveRequest(id, user.org_id);
    }
    approveLeaveRequest(user, id) {
        return this.hrService.approveLeaveRequest(id, user.org_id, user.id, user.role);
    }
    rejectLeaveRequest(user, id, body) {
        return this.hrService.rejectLeaveRequest(id, user.org_id, user.id, user.role, body.rejection_reason);
    }
    deleteLeaveRequest(user, id) {
        return this.hrService.deleteLeaveRequest(id, user.org_id, user.id);
    }
    getHrStats(user) {
        return this.hrService.getHrStats(user.org_id);
    }
};
exports.HrController = HrController;
__decorate([
    (0, common_1.Post)('employees'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Get)('employees'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "findAllEmployees", null);
__decorate([
    (0, common_1.Get)('employees/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "findOneEmployee", null);
__decorate([
    (0, common_1.Put)('employees/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Delete)('employees/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "deleteEmployee", null);
__decorate([
    (0, common_1.Get)('departments'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Post)('leaves'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_leave_request_dto_1.CreateLeaveRequestDto]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createLeaveRequest", null);
__decorate([
    (0, common_1.Get)('leaves'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "findAllLeaveRequests", null);
__decorate([
    (0, common_1.Get)('leaves/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "findOneLeaveRequest", null);
__decorate([
    (0, common_1.Post)('leaves/:id/approve'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "approveLeaveRequest", null);
__decorate([
    (0, common_1.Post)('leaves/:id/reject'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "rejectLeaveRequest", null);
__decorate([
    (0, common_1.Delete)('leaves/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "deleteLeaveRequest", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getHrStats", null);
exports.HrController = HrController = __decorate([
    (0, common_1.Controller)('hr'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [hr_service_1.HrService])
], HrController);
//# sourceMappingURL=hr.controller.js.map