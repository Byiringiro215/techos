import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { LeaveRequest } from '../../entities/leave-request.entity';
import { User, UserRole } from '../../entities/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { ActivityLogService } from '../../common/services/activity-log.service';
export declare class HrService {
    private employeesRepository;
    private leaveRequestsRepository;
    private usersRepository;
    private notificationsService;
    private workspaceService;
    private activityLogService;
    constructor(employeesRepository: Repository<Employee>, leaveRequestsRepository: Repository<LeaveRequest>, usersRepository: Repository<User>, notificationsService: NotificationsService, workspaceService: WorkspaceService, activityLogService: ActivityLogService);
    createEmployee(org_id: string, createEmployeeDto: CreateEmployeeDto): Promise<{
        success: boolean;
        data: Employee;
    }>;
    findAllEmployees(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: {
            id: string;
            org_id: string;
            user_id: string;
            employee_number: string;
            position: string;
            employment_type: string;
            hire_date: string;
            start_date: string;
            salary: number;
            status: string;
            manager_id: string;
            emergency_contact: string;
            skills: string[];
            created_at: Date;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                email: string;
                avatar: string;
                role: UserRole;
            } | null;
            manager: {
                id: string;
                first_name: string;
                last_name: string;
                email: string;
            } | null;
        }[];
    }>;
    private mapEmployeeRow;
    findOneEmployee(id: string, org_id: string): Promise<{
        success: boolean;
        data: {
            leave_requests: LeaveRequest[];
            id: string;
            org_id: string;
            user_id: string;
            employee_number: string;
            position: string;
            employment_type: string;
            hire_date: string;
            start_date: string;
            salary: number;
            status: string;
            manager_id: string;
            emergency_contact: string;
            skills: string[];
            created_at: Date;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                email: string;
                avatar: string;
                role: UserRole;
            } | null;
            manager: {
                id: string;
                first_name: string;
                last_name: string;
                email: string;
            } | null;
        };
    }>;
    getEmployeeActivity(id: string, org_id: string): Promise<{
        success: boolean;
        data: import("../../entities").ActivityEvent[];
    }>;
    updateEmployee(id: string, org_id: string, updateData: Partial<Employee>, actor?: any): Promise<{
        success: boolean;
        data: {
            id: string;
            org_id: string;
            user_id: string;
            employee_number: string;
            position: string;
            employment_type: string;
            hire_date: string;
            start_date: string;
            salary: number;
            status: string;
            manager_id: string;
            emergency_contact: string;
            skills: string[];
            created_at: Date;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                email: string;
                avatar: string;
                role: UserRole;
            } | null;
            manager: {
                id: string;
                first_name: string;
                last_name: string;
                email: string;
            } | null;
        };
    }>;
    deleteEmployee(id: string, org_id: string, actor?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    createLeaveRequest(org_id: string, actor: any, createLeaveRequestDto: CreateLeaveRequestDto): Promise<{
        success: boolean;
        data: LeaveRequest;
    }>;
    findAllLeaveRequests(org_id: string, filters?: any): Promise<{
        success: boolean;
        data: {
            employee_first_name: string | null;
            employee_last_name: string | null;
            role: UserRole | null;
            employee: {
                id: string;
                user_id: string;
                position: string;
                user: {
                    id: string;
                    first_name: string;
                    last_name: string;
                    email: string;
                    role: UserRole;
                } | null;
            } | null;
            id: string;
            employee_id: string;
            org_id: string;
            type: string;
            start_date: string;
            end_date: string;
            status: string;
            reason: string;
            approved_by: string;
            rejection_reason: string;
            created_at: Date;
        }[];
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
            role_count: number;
        };
    }>;
}
