export declare class CreateInvoiceDto {
    contact_id?: string;
    invoice_number: string;
    amount: number;
    tax?: number;
    total: number;
    due_date: string;
    issued_date: string;
    items: any[];
    notes?: string;
}
