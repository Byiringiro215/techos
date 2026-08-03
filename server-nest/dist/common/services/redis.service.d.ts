import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private client;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    hset(key: string, field: string, value: string): Promise<void>;
    hget(key: string, field: string): Promise<string | null>;
    hgetall(key: string): Promise<Record<string, string>>;
    expire(key: string, seconds: number): Promise<void>;
    incr(key: string): Promise<number>;
    decr(key: string): Promise<number>;
    lpush(key: string, ...values: string[]): Promise<number>;
    rpop(key: string): Promise<string | null>;
    lrange(key: string, start: number, stop: number): Promise<string[]>;
    getClient(): Redis;
}
