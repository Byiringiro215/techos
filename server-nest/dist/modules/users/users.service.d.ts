import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(org_id: string): Promise<{
        success: boolean;
        data: User[];
    }>;
    findOne(id: string, org_id: string): Promise<{
        success: boolean;
        data: User;
    }>;
    update(id: string, org_id: string, updateData: Partial<User>): Promise<{
        success: boolean;
        data: User;
    }>;
}
