/* eslint-disable prettier/prettier */
import { PrismaClient, Prisma } from '@prisma/client';
import { Logger } from 'winston';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super({
      log: [
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    try {
      // Memaksa koneksi awal
      await this.$connect();
      this.logger.info('✅ PostgreSQL connected via Prisma');
    } catch (error) {
      this.logger.error('❌ Failed to connect to PostgreSQL', error);
      throw error;
    }

    this.$on('connect', () => {
      this.logger.info('PostgreSQL connected');
    });
    this.$on('info', (e) => {
      this.logger.info(e);
    });
    this.$on('warn', (e) => {
      this.logger.warn(e);
    });
    this.$on('error', (e) => {
      this.logger.error(e);
    });
    this.$on('query', (e) => {
      this.logger.info(e);
    });
  }
}
