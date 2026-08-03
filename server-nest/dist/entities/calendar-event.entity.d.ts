export declare class CalendarEvent {
    id: string;
    org_id: string;
    title: string;
    description: string;
    start_datetime: string;
    end_datetime: string;
    all_day: boolean;
    type: string;
    color: string;
    recurrence: any;
    created_by: string;
    attendees: string[];
    created_at: Date;
}
