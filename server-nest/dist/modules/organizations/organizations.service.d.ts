import { Repository } from 'typeorm';
import { Organization } from '../../entities/organization.entity';
export declare class OrganizationsService {
    private organizationsRepository;
    constructor(organizationsRepository: Repository<Organization>);
    findOne(id: string): Promise<{
        success: boolean;
        data: Organization;
    }>;
    update(id: string, updateData: Partial<Organization>): Promise<{
        success: boolean;
        data: Organization;
    }>;
}
