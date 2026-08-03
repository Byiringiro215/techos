"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadInterceptor = void 0;
const common_1 = require("@nestjs/common");
let FileUploadInterceptor = class FileUploadInterceptor {
    maxSize;
    allowedMimeTypes;
    constructor(maxSize = 10 * 1024 * 1024, allowedMimeTypes) {
        this.maxSize = maxSize;
        this.allowedMimeTypes = allowedMimeTypes;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const file = request.file;
        const files = request.files;
        if (file) {
            this.validateFile(file);
        }
        if (files && Array.isArray(files)) {
            files.forEach((f) => this.validateFile(f));
        }
        return next.handle();
    }
    validateFile(file) {
        if (file.size > this.maxSize) {
            throw new common_1.BadRequestException(`File size exceeds maximum allowed size of ${this.maxSize / 1024 / 1024}MB`);
        }
        if (this.allowedMimeTypes && !this.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
        }
    }
};
exports.FileUploadInterceptor = FileUploadInterceptor;
exports.FileUploadInterceptor = FileUploadInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Number, Array])
], FileUploadInterceptor);
//# sourceMappingURL=file-upload.interceptor.js.map