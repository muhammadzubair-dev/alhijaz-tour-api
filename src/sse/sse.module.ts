import { Module } from '@nestjs/common';
import { RedisService } from '../common/redis.service';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';

@Module({
  imports: [],
  controllers: [SseController],
  providers: [RedisService, SseService],
  exports: [SseService],
})
// eslint-disable-next-line prettier/prettier
export class SseModule { }
