import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private messagesService;
    constructor(messagesService: MessagesService);
    create(user: any, createMessageDto: CreateMessageDto): Promise<{
        success: boolean;
        data: any;
    }>;
    findAll(user: any, channelId: string, limit?: number, before?: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(user: any, id: string, body: {
        content: string;
    }): Promise<{
        success: boolean;
        data: any;
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addReaction(user: any, id: string, body: {
        emoji: string;
    }): Promise<{
        success: boolean;
        data: {
            reactions: Record<string, string[]>;
        };
    }>;
    removeReaction(user: any, id: string, emoji: string): Promise<{
        success: boolean;
        data: {
            reactions: Record<string, string[]>;
        };
    }>;
    getThread(user: any, id: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    search(user: any, channelId: string, query: string): Promise<{
        success: boolean;
        data: any[];
    }>;
}
