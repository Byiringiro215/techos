import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { Organization } from '../../entities/organization.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersRepository;
    private organizationsRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, organizationsRepository: Repository<Organization>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        data: {
            token: string;
            user: {
                id: string;
                email: string;
                first_name: string;
                last_name: string;
                role: UserRole;
                org_id: string;
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
                role: UserRole;
                org_id: string;
            };
        };
    }>;
    getProfile(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            first_name: string;
            last_name: string;
            role: UserRole;
            avatar: string;
            org_id: string;
            organization: Organization;
            preferences: any;
        };
    }>;
}
