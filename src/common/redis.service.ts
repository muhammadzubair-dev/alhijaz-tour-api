import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
  private readonly defaultExpireSeconds: number;
  private subscriber: Redis; // 👈 tambahan untuk listening (Pub/Sub)

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    readonly configService: ConfigService,
  ) {
    super({
      host: configService.get('REDIS_HOST') || 'localhost',
      port: parseInt(configService.get('REDIS_PORT') || '6379'),
      password: configService.get('REDIS_PASSWORD') || undefined,
    });

    // Buat client subscriber untuk menerima pesan
    this.subscriber = new Redis({
      host: configService.get('REDIS_HOST') || 'localhost',
      port: parseInt(configService.get('REDIS_PORT') || '6379'),
      password: configService.get('REDIS_PASSWORD') || undefined,
    });

    this.defaultExpireSeconds = parseInt(
      configService.get('REDIS_DEFAULT_EXPIRE') || '86400',
    );
  }

  onModuleInit() {
    this.on('connect', () =>
      this.logger.info('✅ Redis connected (Publisher)'),
    );
    this.on('error', (err) => this.logger.error(`Redis error: ${err}`));
    this.on('close', () => this.logger.warn('Redis connection closed'));
    this.on('reconnecting', () => this.logger.info('Redis reconnecting...'));

    this.subscriber.on('connect', () =>
      this.logger.info('✅ Redis connected (Subscriber)'),
    );
    this.subscriber.on('error', (err) =>
      this.logger.error(`Redis subscriber error: ${err}`),
    );
  }

  async setKey(key: string, value: string): Promise<'OK' | null> {
    return await this.set(key, value, 'EX', this.defaultExpireSeconds);
  }

  async getKey(key: string): Promise<string | null> {
    return await this.get(key);
  }

  // 👇 Tambahan: publish pesan ke channel
  async publishEvent(channel: string, payload: any): Promise<number> {
    return await this.publish(channel, JSON.stringify(payload));
  }

  // 👇 Tambahan: subscribe ke channel
  async subscribeEvent(
    channel: string,
    callback: (data: any) => void,
  ): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (_channel, message) => {
      try {
        const parsed = JSON.parse(message);
        callback(parsed);
      } catch (e) {
        this.logger.error(
          `Failed to parse message on ${channel}: ${e.message}`,
        );
      }
    });
  }
}
