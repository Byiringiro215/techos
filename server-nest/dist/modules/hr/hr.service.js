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
const workspace_service_1 = require("../workspace/workspace.service");
const activity_log_service_1 = require("../../common/services/activity-log.service");
let HrService = class HrService {
    employeesRepository;
    leaveRequestsRepository;
    usersRepository;
    notificationsService;
    workspaceService;
    activityLogService;
    constructor(employeesRepository, leaveRequestsRepository, usersRepository, notificationsService, workspaceService, activityLogService) {
        this.employeesRepository = employeesRepository;
        this.leaveRequestsRepository = leaveRequestsRepository;
        this.usersRepository = usersRepository;
        this.notificationsService = notificationsService;
        this.workspaceService = workspaceService;
        this.activityLogService = activityLogService;
    }
    async createEmployee(org_id, createEmployeeDto) {
        const user = await this.usersRepository.findOne({
            where: { id: createEmployeeDto.user_id, org_id },
        });
        const roleLabel = (user?.role || 'team member').toString().replace(/_/g, ' ');
        const employee = this.employeesRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createEmployeeDto,
            department: createEmployeeDto.department || roleLabel,
            position: createEmployeeDto.position || roleLabel,
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
        if (filters?.status)
            where.status = filters.status;
        const employees = await this.employeesRepository.find({
            where,
            order: { created_at: 'DESC' },
        });
        const userIds = [...new Set(employees.map((e) => e.user_id).filter(Boolean))];
        const users = userIds.length
            ? await this.usersRepository.find({ where: { id: (0, typeorm_2.In)(userIds) } })
            : [];
        const userMap = new Map(users.map((u) => [String(u.id), u]));
        const data = employees.map((row) => {
            const user = userMap.get(String(row.user_id));
            return this.mapEmployeeRow(row, user);
        });
        return {
            success: true,
            data,
        };
    }
    mapEmployeeRow(row, user, manager) {
        return {
            id: row.id,
            org_id: row.org_id,
            user_id: row.user_id,
            employee_number: `E-${String(row.id).slice(0, 4).toUpperCase()}`,
            position: row.position,
            employment_type: row.employment_type,
            hire_date: row.start_date,
            start_date: row.start_date,
            salary: row.salary,
            status: row.status,
            manager_id: row.manager_id,
            emergency_contact: row.emergency_contact,
            skills: row.skills,
            created_at: row.created_at,
            user: user
                ? {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                }
                : null,
            manager: manager
                ? {
                    id: manager.id,
                    first_name: manager.first_name,
                    last_name: manager.last_name,
                    email: manager.email,
                }
                : null,
        };
    }
    async findOneEmployee(id, org_id) {
        const employee = await this.employeesRepository.findOne({
            where: { id, org_id },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const [user, manager, leaveRequests] = await Promise.all([
            this.usersRepository.findOne({ where: { id: employee.user_id } }),
            employee.manager_id
                ? this.usersRepository.findOne({ where: { id: employee.manager_id } })
                : Promise.resolve(null),
            this.leaveRequestsRepository.find({
                where: { employee_id: id },
                order: { created_at: 'DESC' },
            }),
        ]);
        return {
            success: true,
            data: {
                ...this.mapEmployeeRow(employee, user, manager),
                leave_requests: leaveRequests,
            },
        };
    }
    async getEmployeeActivity(id, org_id) {
        const employee = await this.employeesRepository.findOne({
            where: { id, org_id },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const data = await this.activityLogService.listForActor(org_id, employee.user_id);
        return { success: true, data };
    }
    async updateEmployee(id, org_id, updateData, actor) {
        const employee = await this.employeesRepository.findOne({
            where: { id, org_id },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const allowed = [
            'position',
            'employment_type',
            'start_date',
            'salary',
            'status',
            'manager_id',
            'emergency_contact',
            'skills',
            'department',
        ];
        for (const key of allowed) {
            if (updateData[key] !== undefined) {
                employee[key] = updateData[key];
            }
        }
        await this.employeesRepository.save(employee);
        const [user, manager] = await Promise.all([
            this.usersRepository.findOne({ where: { id: employee.user_id } }),
            employee.manager_id
                ? this.usersRepository.findOne({ where: { id: employee.manager_id } })
                : Promise.resolve(null),
        ]);
        const validRoles = Object.values(user_entity_1.UserRole);
        if (user && updateData.position && validRoles.includes(updateData.position)) {
            user.role = updateData.position;
            await this.usersRepository.save(user);
        }
        const displayName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() ||
            user?.email ||
            employee.position ||
            'employee';
        await this.workspaceService.recordActivity(org_id, 'employees', employee.id, 'updated', `updated employee "${displayName}"`, actor);
        return {
            success: true,
            data: this.mapEmployeeRow(employee, user, manager),
        };
    }
    async deleteEmployee(id, org_id, actor) {
        const employee = await this.employeesRepository.findOne({
            where: { id, org_id },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const user = await this.usersRepository.findOne({ where: { id: employee.user_id } });
        const displayName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() ||
            user?.email ||
            employee.position ||
            'employee';
        await this.employeesRepository.remove(employee);
        await this.workspaceService.recordActivity(org_id, 'employees', id, 'deleted', `removed employee "${displayName}"`, actor);
        return {
            success: true,
            message: 'Employee deleted successfully',
        };
    }
    async createLeaveRequest(org_id, actor, createLeaveRequestDto) {
        const employee = await this.employeesRepository.findOne({
            where: { user_id: actor?.id, org_id },
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
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'created',
            resource_type: 'leaves',
            resource_id: leaveRequest.id,
            summary: `requested ${createLeaveRequestDto.type || 'leave'} leave`,
        });
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
        const leaveRequests = await this.leaveRequestsRepository.find({
            where,
            order: { created_at: 'DESC' },
        });
        const employeeIds = [...new Set(leaveRequests.map((l) => String(l.employee_id)).filter(Boolean))];
        const employees = employeeIds.length
            ? await this.employeesRepository.find({ where: { id: (0, typeorm_2.In)(employeeIds) } })
            : [];
        const employeeMap = new Map(employees.map((e) => [String(e.id), e]));
        const userIds = [...new Set(employees.map((e) => String(e.user_id)).filter(Boolean))];
        const users = userIds.length
            ? await this.usersRepository.find({ where: { id: (0, typeorm_2.In)(userIds) } })
            : [];
        const userMap = new Map(users.map((u) => [String(u.id), u]));
        const data = leaveRequests.map((leave) => {
            const employee = employeeMap.get(String(leave.employee_id));
            const user = employee ? userMap.get(String(employee.user_id)) : null;
            return {
                ...leave,
                employee_first_name: user?.first_name || null,
                employee_last_name: user?.last_name || null,
                role: user?.role || null,
                employee: employee
                    ? {
                        id: employee.id,
                        user_id: employee.user_id,
                        position: employee.position,
                        user: user
                            ? {
                                id: user.id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                email: user.email,
                                role: user.role,
                            }
                            : null,
                    }
                    : null,
            };
        });
        return {
            success: true,
            data,
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
        const users = await this.usersRepository.find({ where: { org_id } });
        const roleCount = new Set(users.map((u) => u.role).filter(Boolean)).size;
        return {
            success: true,
            data: {
                total_employees: totalEmployees,
                pending_leave_requests: pendingLeaves,
                role_count: roleCount,
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
        notifications_service_1.NotificationsService,
        workspace_service_1.WorkspaceService,
        activity_log_service_1.ActivityLogService])
], HrService);
//# sourceMappingURL=hr.service.js.map