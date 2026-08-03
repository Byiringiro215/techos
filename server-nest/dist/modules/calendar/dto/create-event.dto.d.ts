export declare class CreateEventDto {
    title: string;
    description?: string;
    start_datetime: string;
    end_datetime: string;
    all_day?: boolean;
    type?: string;
    color?: string;
    recurrence?: any;
    attendees?: string[];
}
