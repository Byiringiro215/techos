export declare class Document {
    id: string;
    org_id: string;
    title: string;
    content: string;
    type: string;
    folder: string;
    tags: string[];
    storage_path: string | null;
    file_mime: string | null;
    file_size: number | null;
    created_by: string;
    version: number;
    is_archived: boolean;
    created_at: Date;
    updated_at: Date;
}
