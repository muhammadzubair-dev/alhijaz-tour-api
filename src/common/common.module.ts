/* eslint-disable prettier/prettier */
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { JwtService } from './jwt.service';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import { AuthMiddleware } from './auth.middleware';
import { UploadService } from './upload.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaService, RedisService, JwtService, UploadService],
  exports: [PrismaService, RedisService, JwtService, UploadService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api');
  }
}
