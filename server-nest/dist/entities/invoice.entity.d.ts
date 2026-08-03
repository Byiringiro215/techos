export declare class Invoice {
    id: string;
    org_id: string;
    contact_id: string;
    invoice_number: string;
    amount: number;
    tax: number;
    total: number;
    status: string;
    due_date: string;
    issued_date: string;
    items: any[];
    notes: string;
    created_at: Date;
}
