import { Organization } from './organization.entity';
export declare enum UserRole {
    CEO = "ceo",
    CTO = "cto",
    FINANCE = "finance",
    SOFTWARE_ENGINEER = "software_engineer",
    UI_UX_DESIGNER = "ui_ux_designer",
    CUSTOMER_SUPPORT = "customer_support"
}
export declare class User {
    id: string;
    org_id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    name: string;
    role: UserRole;
    avatar: string;
    status: string;
    two_factor_enabled: boolean;
    two_factor_secret: string;
    preferences: any;
    created_at: Date;
    organization: Organization;
}
