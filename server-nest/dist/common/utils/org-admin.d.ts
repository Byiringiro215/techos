export declare function isOrgAdmin(role?: string | null): boolean;
export declare function isDeliveryAdmin(role?: string | null): boolean;
export declare function assertOrgAdmin(user?: {
    role?: string;
} | null, action?: string): void;
export declare function assertDeliveryAdmin(user?: {
    role?: string;
} | null, action?: string): void;
