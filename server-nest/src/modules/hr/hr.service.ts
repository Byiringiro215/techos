import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Employee } from '../../entities/employee.entity';
import { LeaveRequest } from '../../entities/leave-request.entity';
import { User, UserRole } from '../../entities/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @InjectRepository(LeaveRequest)
    private leaveRequestsRepository: Repository<LeaveRequest>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  // Employees
  async createEmployee(org_id: string, createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeesRepository.create({
      id: randomUUID(),
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

  async findAllEmployees(org_id: string, filters?: any) {
    const where: any = { org_id };

    if (filters?.department) {
      where.department = filters.department;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const employees = await this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect(User, 'user', 'employee.user_id = user.id')
      .leftJoinAndSelect(User, 'manager', 'employee.manager_id = manager.id')
      .where('employee.org_id = :org_id', { org_id })
      .andWhere(filters?.department ? 'employee.department = :department' : '1=1', 
        filters?.department ? { department: filters.department } : {})
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

  async findOneEmployee(id: string, org_id: string) {
    const employee = await this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect(User, 'user', 'employee.user_id = user.id')
      .leftJoinAndSelect(User, 'manager', 'employee.manager_id = manager.id')
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
      throw new NotFoundException('Employee not found');
    }

    // Get leave requests
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

  async updateEmployee(id: string, org_id: string, updateData: Partial<Employee>) {
    const employee = await this.employeesRepository.findOne({
      where: { id, org_id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    Object.assign(employee, updateData);
    await this.employeesRepository.save(employee);

    return {
      success: true,
      data: employee,
    };
  }

  async deleteEmployee(id: string, org_id: string) {
    const employee = await this.employeesRepository.findOne({
      where: { id, org_id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.employeesRepository.remove(employee);

    return {
      success: true,
      message: 'Employee deleted successfully',
    };
  }

  async getDepartments(org_id: string) {
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

  // Leave Requests
  async createLeaveRequest(org_id: string, user_id: string, createLeaveRequestDto: CreateLeaveRequestDto) {
    // Get employee record
    const employee = await this.employeesRepository.findOne({
      where: { user_id, org_id },
    });

    if (!employee) {
      throw new NotFoundException('Employee record not found');
    }

    const leaveRequest = this.leaveRequestsRepository.create({
      id: randomUUID(),
      employee_id: employee.id,
      org_id,
      ...createLeaveRequestDto,
      status: 'pending',
    });

    await this.leaveRequestsRepository.save(leaveRequest);

    // Notify manager and HR
    await this.notifyLeaveRequestCreated(org_id, employee, leaveRequest);

    return {
      success: true,
      data: leaveRequest,
    };
  }

  async findAllLeaveRequests(org_id: string, filters?: any) {
    const where: any = { org_id };

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
      .leftJoin(Employee, 'employee', 'leave.employee_id = employee.id')
      .leftJoin(User, 'user', 'employee.user_id = user.id')
      .where('leave.org_id = :org_id', { org_id })
      .andWhere(filters?.status ? 'leave.status = :status' : '1=1', 
        filters?.status ? { status: filters.status } : {})
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

  async findOneLeaveRequest(id: string, org_id: string) {
    const leaveRequest = await this.leaveRequestsRepository.findOne({
      where: { id, org_id },
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    return {
      success: true,
      data: leaveRequest,
    };
  }

  async approveLeaveRequest(id: string, org_id: string, user_id: string, user_role: string) {
    // Check if user has permission (HR Manager or CEO)
    if (![UserRole.HR_MANAGER, UserRole.CEO].includes(user_role as UserRole)) {
      throw new ForbiddenException('You do not have permission to approve leave requests');
    }

    const leaveRequest = await this.leaveRequestsRepository.findOne({
      where: { id, org_id },
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    leaveRequest.status = 'approved';
    leaveRequest.approved_by = user_id;
    await this.leaveRequestsRepository.save(leaveRequest);

    // Get employee info
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

  async rejectLeaveRequest(id: string, org_id: string, user_id: string, user_role: string, rejection_reason?: string) {
    // Check permission
    if (![UserRole.HR_MANAGER, UserRole.CEO].includes(user_role as UserRole)) {
      throw new ForbiddenException('You do not have permission to reject leave requests');
    }

    const leaveRequest = await this.leaveRequestsRepository.findOne({
      where: { id, org_id },
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    leaveRequest.status = 'rejected';
    if (rejection_reason) {
      leaveRequest.rejection_reason = rejection_reason;
    }
    await this.leaveRequestsRepository.save(leaveRequest);

    // Get employee info
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

  async deleteLeaveRequest(id: string, org_id: string, user_id: string) {
    const leaveRequest = await this.leaveRequestsRepository.findOne({
      where: { id, org_id },
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    // Get employee to verify ownership
    const employee = await this.employeesRepository.findOne({
      where: { id: leaveRequest.employee_id },
    });

    // Only allow deletion if pending and user owns it
    if (leaveRequest.status !== 'pending' || (employee && employee.user_id !== user_id)) {
      throw new ForbiddenException('You can only delete your own pending leave requests');
    }

    await this.leaveRequestsRepository.remove(leaveRequest);

    return {
      success: true,
      message: 'Leave request deleted successfully',
    };
  }

  // Helper methods
  private async notifyLeaveRequestCreated(org_id: string, employee: Employee, leaveRequest: LeaveRequest) {
    // Notify manager
    if (employee.manager_id) {
      await this.notificationsService.create(org_id, {
        user_id: employee.manager_id,
        type: 'leave_request_pending',
        title: 'New Leave Request',
        message: `Leave request from employee for ${leaveRequest.type} leave`,
        send_email: true,
      });
    }

    // Notify HR team
    const hrUsers = await this.usersRepository.find({
      where: { org_id, role: UserRole.HR_MANAGER },
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

  // Statistics
  async getHrStats(org_id: string) {
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
}
