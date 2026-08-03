import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { LeaveRequest } from '../../entities/leave-request.entity';
import { User } from '../../entities/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class HrService {
    private employeesRepository;
    private leaveRequestsRepository;
    private usersRepository;
    private notificationsService;
    constructor(employeesRepository: Repository<Employee>, leaveRequestsRepository: Repository<LeaveRequest>, usersRepository: Repository<User>, notificationsService: NotificationsService);
    createEmployee(org_id: string, createEmployeeDto: CreateEmployeeDto): Promise<{
        success: boolean;
        data: Employee;
    }>;
    findAllEmployees(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOneEmployee(id: string, org_id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    updateEmployee(id: string, org_id: string, updateData: Partial<Employee>): Promise<{
        success: boolean;
        data: Employee;
    }>;
    deleteEmployee(id: string, org_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getDepartments(org_id: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    createLeaveRequest(org_id: string, user_id: string, createLeaveRequestDto: CreateLeaveRequestDto): Promise<{
        success: boolean;
        data: LeaveRequest;
    }>;
    findAllLeaveRequests(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOneLeaveRequest(id: string, org_id: string): Promise<{
        success: boolean;
        data: LeaveRequest;
    }>;
    approveLeaveRequest(id: string, org_id: string, user_id: string, user_role: string): Promise<{
        success: boolean;
        data: LeaveRequest;
    }>;
    rejectLeaveRequest(id: string, org_id: string, user_id: string, user_role: string, rejection_reason?: string): Promise<{
        success: boolean;
        data: LeaveRequest;
    }>;
    deleteLeaveRequest(id: string, org_id: string, user_id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private notifyLeaveRequestCreated;
    getHrStats(org_id: string): Promise<{
        success: boolean;
        data: {
            total_employees: number;
            pending_leave_requests: number;
            department_count: number;
        };
    }>;
}
