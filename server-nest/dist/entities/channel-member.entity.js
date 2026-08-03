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
exports.ChannelMember = void 0;
const typeorm_1 = require("typeorm");
let ChannelMember = class ChannelMember {
    id;
    channel_id;
    user_id;
    role;
    last_read_at;
    joined_at;
};
exports.ChannelMember = ChannelMember;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], ChannelMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChannelMember.prototype, "channel_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChannelMember.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'member' }),
    __metadata("design:type", String)
], ChannelMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ChannelMember.prototype, "last_read_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChannelMember.prototype, "joined_at", void 0);
exports.ChannelMember = ChannelMember = __decorate([
    (0, typeorm_1.Entity)('channel_members')
], ChannelMember);
//# sourceMappingURL=channel-member.entity.js.map