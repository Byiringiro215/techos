import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(user: any): Promise<{
        success: boolean;
        data: import("../../entities").User[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: import("../../entities").User;
    }>;
    update(user: any, id: string, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").User;
    }>;
}
