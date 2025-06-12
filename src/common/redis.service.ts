import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
  private readonly defaultExpireSeconds: number;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    readonly configService: ConfigService,
  ) {
    super({
      host: configService.get('REDIS_HOST') || 'localhost',
      port: parseInt(configService.get('REDIS_PORT') || '6379'),
      password: configService.get('REDIS_PASSWORD') || undefined,
    });

    this.defaultExpireSeconds = parseInt(
      configService.get('REDIS_DEFAULT_EXPIRE') || '86400',
    ); // default 1 hari
  }

  onModuleInit() {
    this.on('connect', () => this.logger.info('✅ Redis connected'));
    this.on('error', (err) => this.logger.error(`Redis error: ${err}`));
    this.on('close', () => this.logger.warn('Redis connection closed'));
    this.on('reconnecting', () => this.logger.info('Redis reconnecting...'));
  }

  async setKey(key: string, value: string): Promise<'OK' | null> {
    return await this.set(key, value, 'EX', this.defaultExpireSeconds);
  }

  async getKey(key: string): Promise<string | null> {
    return await this.get(key);
  }
}
