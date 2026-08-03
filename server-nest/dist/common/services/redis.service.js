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
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = class RedisService {
    configService;
    client;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.client = new ioredis_1.Redis({
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: this.configService.get('REDIS_PORT', 6379),
            password: this.configService.get('REDIS_PASSWORD'),
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });
        this.client.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
        this.client.on('connect', () => {
            console.log('✅ Redis connected successfully');
        });
    }
    onModuleDestroy() {
        this.client.quit();
    }
    async get(key) {
        return this.client.get(key);
    }
    async set(key, value, ttl) {
        if (ttl) {
            await this.client.setex(key, ttl, value);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async del(key) {
        await this.client.del(key);
    }
    async exists(key) {
        const result = await this.client.exists(key);
        return result === 1;
    }
    async hset(key, field, value) {
        await this.client.hset(key, field, value);
    }
    async hget(key, field) {
        return this.client.hget(key, field);
    }
    async hgetall(key) {
        return this.client.hgetall(key);
    }
    async expire(key, seconds) {
        await this.client.expire(key, seconds);
    }
    async incr(key) {
        return this.client.incr(key);
    }
    async decr(key) {
        return this.client.decr(key);
    }
    async lpush(key, ...values) {
        return this.client.lpush(key, ...values);
    }
    async rpop(key) {
        return this.client.rpop(key);
    }
    async lrange(key, start, stop) {
        return this.client.lrange(key, start, stop);
    }
    getClient() {
        return this.client;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map