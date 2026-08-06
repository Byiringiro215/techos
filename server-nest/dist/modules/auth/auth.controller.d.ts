import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        data: {
            token: string;
            user: {
                id: string;
                email: string;
                first_name: string;
                last_name: string;
                role: import("../../entities/user.entity").UserRole;
                org_id: string;
                preferences: any;
            };
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        data: {
            token: string;
            user: {
                id: string;
                email: string;
                first_name: string;
                last_name: string;
                role: import("../../entities/user.entity").UserRole;
                org_id: string;
                preferences: any;
            };
        };
    }>;
    getProfile(user: any): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            first_name: string;
            last_name: string;
            role: import("../../entities/user.entity").UserRole;
            avatar: string;
            org_id: string;
            organization: import("../../entities").Organization;
            preferences: any;
        };
    }>;
    getMe(user: any): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            first_name: string;
            last_name: string;
            role: import("../../entities/user.entity").UserRole;
            avatar: string;
            org_id: string;
            organization: import("../../entities").Organization;
            preferences: any;
        };
    }>;
}
