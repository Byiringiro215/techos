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
        data: any[];
    }>;
    findOneEmployee(user: any, id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    updateEmployee(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").Employee;
    }>;
    deleteEmployee(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getDepartments(user: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    createLeaveRequest(user: any, createLeaveRequestDto: CreateLeaveRequestDto): Promise<{
        success: boolean;
        data: import("../../entities").LeaveRequest;
    }>;
    findAllLeaveRequests(user: any, filters: any): Promise<{
        success: boolean;
        data: any[];
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
            department_count: number;
        };
    }>;
}
