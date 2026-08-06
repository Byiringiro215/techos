import { HrService } from './hr.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
export declare class HrController {
    private hrService;
    constructor(hrService: HrService);
    createEmployee(user: any, createEmployeeDto: CreateEmployeeDto): Promise<{
        success: boolean;
        data: import("../../entities").Employee;
    }>;
    findAllEmployees(user: any, filters: any): Promise<{
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
                role: import("../../entities/user.entity").UserRole;
            } | null;
            manager: {
                id: string;
                first_name: string;
                last_name: string;
                email: string;
            } | null;
        }[];
    }>;
    getEmployeeActivity(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").ActivityEvent[];
    }>;
    findOneEmployee(user: any, id: string): Promise<{
        success: boolean;
        data: {
            leave_requests: import("../../entities").LeaveRequest[];
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
                role: import("../../entities/user.entity").UserRole;
            } | null;
            manager: {
                id: string;
                first_name: string;
                last_name: string;
                email: string;
            } | null;
        };
    }>;
    updateEmployee(user: any, id: string, updateData: any): Promise<{
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
                role: import("../../entities/user.entity").UserRole;
            } | null;
            manager: {
                id: string;
                first_name: string;
                last_name: string;
                email: string;
            } | null;
        };
    }>;
    deleteEmployee(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createLeaveRequest(user: any, createLeaveRequestDto: CreateLeaveRequestDto): Promise<{
        success: boolean;
        data: import("../../entities").LeaveRequest;
    }>;
    findAllLeaveRequests(user: any, filters: any): Promise<{
        success: boolean;
        data: {
            employee_first_name: string | null;
            employee_last_name: string | null;
            role: import("../../entities/user.entity").UserRole | null;
            employee: {
                id: string;
                user_id: string;
                position: string;
                user: {
                    id: string;
                    first_name: string;
                    last_name: string;
                    email: string;
                    role: import("../../entities/user.entity").UserRole;
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
    findOneLeaveRequest(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").LeaveRequest;
    }>;
    approveLeaveRequest(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").LeaveRequest;
    }>;
    rejectLeaveRequest(user: any, id: string, body: {
        rejection_reason?: string;
    }): Promise<{
        success: boolean;
        data: import("../../entities").LeaveRequest;
    }>;
    deleteLeaveRequest(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getHrStats(user: any): Promise<{
        success: boolean;
        data: {
            total_employees: number;
            pending_leave_requests: number;
            role_count: number;
        };
    }>;
}
