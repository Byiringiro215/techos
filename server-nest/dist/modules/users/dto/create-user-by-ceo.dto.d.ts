import { UserRole } from '../../../entities/user.entity';
export declare class CreateUserByCeoDto {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    position?: string;
    employment_type?: string;
    status?: string;
    salary?: number;
}
