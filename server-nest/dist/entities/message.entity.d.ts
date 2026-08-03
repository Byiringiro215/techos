export declare class Message {
    id: string;
    channel_id: string;
    user_id: string;
    content: string;
    parent_message_id: string;
    attachments: string[];
    mentions: string[];
    reactions: Record<string, string[]>;
    is_edited: boolean;
    is_deleted: boolean;
    edited_at: Date;
    created_at: Date;
    updated_at: Date;
}
