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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    configService;
    logger = new common_1.Logger(RedisService_1.name);
    client = null;
    enabled = true;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const disabled = this.configService.get('REDIS_ENABLED') === 'false';
        if (disabled) {
            this.enabled = false;
            this.logger.warn('Redis disabled via REDIS_ENABLED=false');
            return;
        }
        this.client = new ioredis_1.Redis({
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: Number(this.configService.get('REDIS_PORT') || 6379),
            password: this.configService.get('REDIS_PASSWORD') || undefined,
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            lazyConnect: false,
            retryStrategy: (times) => {
                if (times > 20) {
                    this.logger.error('Redis reconnect gave up after repeated failures');
                    return null;
                }
                return Math.min(times * 100, 3000);
            },
        });
        this.client.on('error', (err) => {
            this.logger.error(`Redis error: ${err.message}`);
        });
        this.client.on('connect', () => {
            this.logger.log('Redis connected');
        });
    }
    onModuleDestroy() {
        void this.client?.quit();
    }
    requireClient() {
        if (!this.client) {
            throw new Error('Redis is not available');
        }
        return this.client;
    }
    isReady() {
        return Boolean(this.client && this.client.status === 'ready');
    }
    async get(key) {
        if (!this.client)
            return null;
        return this.client.get(key);
    }
    async set(key, value, ttl) {
        if (!this.client)
            return;
        if (ttl) {
            await this.client.setex(key, ttl, value);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async del(key) {
        if (!this.client)
            return;
        await this.client.del(key);
    }
    async exists(key) {
        if (!this.client)
            return false;
        const result = await this.client.exists(key);
        return result === 1;
    }
    async hset(key, field, value) {
        if (!this.client)
            return;
        await this.client.hset(key, field, value);
    }
    async hget(key, field) {
        if (!this.client)
            return null;
        return this.client.hget(key, field);
    }
    async hgetall(key) {
        if (!this.client)
            return {};
        return this.client.hgetall(key);
    }
    async expire(key, seconds) {
        if (!this.client)
            return;
        await this.client.expire(key, seconds);
    }
    async incr(key) {
        if (!this.client)
            return 0;
        return this.client.incr(key);
    }
    async decr(key) {
        if (!this.client)
            return 0;
        return this.client.decr(key);
    }
    async lpush(key, ...values) {
        if (!this.client)
            return 0;
        return this.client.lpush(key, ...values);
    }
    async rpop(key) {
        if (!this.client)
            return null;
        return this.client.rpop(key);
    }
    async lrange(key, start, stop) {
        if (!this.client)
            return [];
        return this.client.lrange(key, start, stop);
    }
    getClient() {
        return this.requireClient();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map