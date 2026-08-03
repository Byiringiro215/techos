import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private organizationsService;
    constructor(organizationsService: OrganizationsService);
    findOne(user: any): Promise<{
        success: boolean;
        data: import("../../entities").Organization;
    }>;
    update(user: any, updateData: any): Promise<{
        success: boolean;
        data: import("../../entities").Organization;
    }>;
}
