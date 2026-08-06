import { UsersService } from './users.service';
import { CreateUserByCeoDto } from './dto/create-user-by-ceo.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateMyPasswordDto } from './dto/update-my-password.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(user: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    createByCeo(user: any, dto: CreateUserByCeoDto): Promise<{
        success: boolean;
        data: {
            user: any;
            employee: import("../../entities").Employee;
            temporary_password: string;
        };
    }>;
    updateMyProfile(user: any, dto: UpdateMyProfileDto): Promise<{
        success: boolean;
        data: any;
    }>;
    updateMyPassword(user: any, dto: UpdateMyPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: any;
    }>;
}
