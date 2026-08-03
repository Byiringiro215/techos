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
exports.HrService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const employee_entity_1 = require("../../entities/employee.entity");
const leave_request_entity_1 = require("../../entities/leave-request.entity");
const user_entity_1 = require("../../entities/user.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let HrService = class HrService {
    employeesRepository;
    leaveRequestsRepository;
    usersRepository;
    notificationsService;
    constructor(employeesRepository, leaveRequestsRepository, usersRepository, notificationsService) {
        this.employeesRepository = employeesRepository;
        this.leaveRequestsRepository = leaveRequestsRepository;
        this.usersRepository = usersRepository;
        this.notificationsService = notificationsService;
    }
    async createEmployee(org_id, createEmployeeDto) {
        const employee = this.employeesRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createEmployeeDto,
            employment_type: createEmployeeDto.employment_type || 'full-time',
            status: 'active',
        });
        await this.employeesRepository.save(employee);
        return {
            success: true,
            data: employee,
        };
    }
    async findAllEmployees(org_id, filters) {
        const where = { org_id };
        if (filters?.department) {
            where.department = filters.department;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        const employees = await this.employeesRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'employee.user_id = user.id')
            .leftJoinAndSelect(user_entity_1.User, 'manager', 'employee.manager_id = manager.id')
            .where('employee.org_id = :org_id', { org_id })
            .andWhere(filters?.department ? 'employee.department = :department' : '1=1', filters?.department ? { department: filters.department } : {})
            .select([
            'employee.*',
            'user.first_name as first_name',
            'user.last_name as last_name',
            'user.email as email',
            'user.avatar as avatar',
            'manager.first_name as manager_first_name',
            'manager.last_name as manager_last_name',
        ])
            .getRawMany();
        return {
            success: true,
            data: employees,
        };
    }
    async findOneEmployee(id, org_id) {
        const employee = await this.employeesRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect(user_entity_1.User, 'user', 'employee.user_id = user.id')
            .leftJoinAndSelect(user_entity_1.User, 'manager', 'employee.manager_id = manager.id')
            .where('employee.id = :id', { id })
            .andWhere('employee.org_id = :org_id', { org_id })
            .select([
            'employee.*',
            'user.first_name as first_name',
            'user.last_name as last_name',
            'user.email as email',
            'user.avatar as avatar',
            'user.role as role',
            'manager.first_name as manager_first_name',
            'manager.last_name as manager_last_name',
        ])
            .getRawOne();
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const leaveRequests = await this.leaveRequestsRepository.find({
            where: { employee_id: id },
            order: { created_at: 'DESC' },
        });
        return {
            success: true,
            data: {
                ...employee,
                leave_requests: leaveRequests,
            },
        };
    }
    async updateEmployee(id, org_id, updateData) {
        const employee = await this.employeesRepository.findOne({
            where: { id, org_id },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        Object.assign(employee, updateData);
        await this.employeesRepository.save(employee);
        return {
            success: true,
            data: employee,
        };
    }
    async deleteEmployee(id, org_id) {
        const employee = await this.employeesRepository.findOne({
            where: { id, org_id },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        await this.employeesRepository.remove(employee);
        return {
            success: true,
            message: 'Employee deleted successfully',
        };
    }
    async getDepartments(org_id) {
        const departments = await this.employeesRepository
            .createQueryBuilder('employee')
            .select('employee.department', 'department')
            .addSelect('COUNT(*)', 'employee_count')
            .where('employee.org_id = :org_id', { org_id })
            .groupBy('employee.department')
            .getRawMany();
        return {
            success: true,
            data: departments,
        };
    }
    async createLeaveRequest(org_id, user_id, createLeaveRequestDto) {
        const employee = await this.employeesRepository.findOne({
            where: { user_id, org_id },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee record not found');
        }
        const leaveRequest = this.leaveRequestsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            employee_id: employee.id,
            org_id,
            ...createLeaveRequestDto,
            status: 'pending',
        });
        await this.leaveRequestsRepository.save(leaveRequest);
        await this.notifyLeaveRequestCreated(org_id, employee, leaveRequest);
        return {
            success: true,
            data: leaveRequest,
        };
    }
    async findAllLeaveRequests(org_id, filters) {
        const where = { org_id };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.employee_id) {
            where.employee_id = filters.employee_id;
        }
        const leaveRequests = await this.leaveRequestsRepository
            .createQueryBuilder('leave')
            .leftJoin(employee_entity_1.Employee, 'employee', 'leave.employee_id = employee.id')
            .leftJoin(user_entity_1.User, 'user', 'employee.user_id = user.id')
            .where('leave.org_id = :org_id', { org_id })
            .andWhere(filters?.status ? 'leave.status = :status' : '1=1', filters?.status ? { status: filters.status } : {})
            .select([
            'leave.*',
            'user.first_name as employee_first_name',
            'user.last_name as employee_last_name',
            'employee.department as department',
        ])
            .orderBy('leave.created_at', 'DESC')
            .getRawMany();
        return {
            success: true,
            data: leaveRequests,
        };
    }
    async findOneLeaveRequest(id, org_id) {
        const leaveRequest = await this.leaveRequestsRepository.findOne({
            where: { id, org_id },
        });
        if (!leaveRequest) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        return {
            success: true,
            data: leaveRequest,
        };
    }
    async approveLeaveRequest(id, org_id, user_id, user_role) {
        if (![user_entity_1.UserRole.CEO].includes(user_role)) {
            throw new common_1.ForbiddenException('You do not have permission to approve leave requests');
        }
        const leaveRequest = await this.leaveRequestsRepository.findOne({
            where: { id, org_id },
        });
        if (!leaveRequest) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        leaveRequest.status = 'approved';
        leaveRequest.approved_by = user_id;
        await this.leaveRequestsRepository.save(leaveRequest);
        const employee = await this.employeesRepository.findOne({
            where: { id: leaveRequest.employee_id },
        });
        if (employee) {
            await this.notificationsService.create(org_id, {
                user_id: employee.user_id,
                type: 'leave_approved',
                title: 'Leave Request Approved',
                message: `Your ${leaveRequest.type} leave from ${leaveRequest.start_date} to ${leaveRequest.end_date} has been approved`,
                send_email: true,
            });
        }
        return {
            success: true,
            data: leaveRequest,
        };
    }
    async rejectLeaveRequest(id, org_id, user_id, user_role, rejection_reason) {
        if (![user_entity_1.UserRole.CEO].includes(user_role)) {
            throw new common_1.ForbiddenException('You do not have permission to reject leave requests');
        }
        const leaveRequest = await this.leaveRequestsRepository.findOne({
            where: { id, org_id },
        });
        if (!leaveRequest) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        leaveRequest.status = 'rejected';
        if (rejection_reason) {
            leaveRequest.rejection_reason = rejection_reason;
        }
        await this.leaveRequestsRepository.save(leaveRequest);
        const employee = await this.employeesRepository.findOne({
            where: { id: leaveRequest.employee_id },
        });
        if (employee) {
            await this.notificationsService.create(org_id, {
                user_id: employee.user_id,
                type: 'leave_rejected',
                title: 'Leave Request Rejected',
                message: `Your ${leaveRequest.type} leave request has been rejected${rejection_reason ? ': ' + rejection_reason : ''}`,
                send_email: true,
            });
        }
        return {
            success: true,
            data: leaveRequest,
        };
    }
    async deleteLeaveRequest(id, org_id, user_id) {
        const leaveRequest = await this.leaveRequestsRepository.findOne({
            where: { id, org_id },
        });
        if (!leaveRequest) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        const employee = await this.employeesRepository.findOne({
            where: { id: leaveRequest.employee_id },
        });
        if (leaveRequest.status !== 'pending' || (employee && employee.user_id !== user_id)) {
            throw new common_1.ForbiddenException('You can only delete your own pending leave requests');
        }
        await this.leaveRequestsRepository.remove(leaveRequest);
        return {
            success: true,
            message: 'Leave request deleted successfully',
        };
    }
    async notifyLeaveRequestCreated(org_id, employee, leaveRequest) {
        if (employee.manager_id) {
            await this.notificationsService.create(org_id, {
                user_id: employee.manager_id,
                type: 'leave_request_pending',
                title: 'New Leave Request',
                message: `Leave request from employee for ${leaveRequest.type} leave`,
                send_email: true,
            });
        }
        const hrUsers = await this.usersRepository.find({
            where: { org_id, role: user_entity_1.UserRole.CEO },
        });
        for (const hrUser of hrUsers) {
            await this.notificationsService.create(org_id, {
                user_id: hrUser.id,
                type: 'leave_request_pending',
                title: 'New Leave Request',
                message: `New ${leaveRequest.type} leave request pending approval`,
                send_email: true,
            });
        }
    }
    async getHrStats(org_id) {
        const totalEmployees = await this.employeesRepository.count({
            where: { org_id, status: 'active' },
        });
        const pendingLeaves = await this.leaveRequestsRepository.count({
            where: { org_id, status: 'pending' },
        });
        const departmentCount = await this.employeesRepository
            .createQueryBuilder('employee')
            .select('COUNT(DISTINCT employee.department)', 'count')
            .where('employee.org_id = :org_id', { org_id })
            .getRawOne();
        return {
            success: true,
            data: {
                total_employees: totalEmployees,
                pending_leave_requests: pendingLeaves,
                department_count: parseInt(departmentCount.count) || 0,
            },
        };
    }
};
exports.HrService = HrService;
exports.HrService = HrService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(leave_request_entity_1.LeaveRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], HrService);
//# sourceMappingURL=hr.service.js.map