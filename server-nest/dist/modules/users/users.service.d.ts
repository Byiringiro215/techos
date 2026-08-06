import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Employee } from '../../entities/employee.entity';
import { CreateUserByCeoDto } from './dto/create-user-by-ceo.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { WorkspaceService } from '../workspace/workspace.service';
export declare class UsersService {
    private usersRepository;
    private employeesRepository;
    private workspaceService;
    constructor(usersRepository: Repository<User>, employeesRepository: Repository<Employee>, workspaceService: WorkspaceService);
    findAll(org_id: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: string, org_id: string, actor: any, updateData: Partial<User>): Promise<{
        success: boolean;
        data: any;
    }>;
    createByCeo(org_id: string, actor: any, dto: CreateUserByCeoDto): Promise<{
        success: boolean;
        data: {
            user: any;
            employee: Employee;
            temporary_password: string;
        };
    }>;
    updateMyProfile(org_id: string, user_id: string, dto: UpdateMyProfileDto): Promise<{
        success: boolean;
        data: any;
    }>;
    updateMyPassword(org_id: string, user_id: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private safeUser;
    private generateTemporaryPassword;
}
