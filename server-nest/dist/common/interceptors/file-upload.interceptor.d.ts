import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class FileUploadInterceptor implements NestInterceptor {
    private readonly maxSize;
    private readonly allowedMimeTypes?;
    constructor(maxSize?: number, allowedMimeTypes?: string[] | undefined);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private validateFile;
}
