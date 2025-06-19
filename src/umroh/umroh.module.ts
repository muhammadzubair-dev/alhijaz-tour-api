import { Module } from '@nestjs/common';
import { UmrohService } from './umroh.service';
import { UmrohController } from './umroh.controller';
import { SseService } from 'src/sse/sse.service';

@Module({
  providers: [UmrohService, SseService],
  controllers: [UmrohController],
})
// eslint-disable-next-line prettier/prettier
export class UmrohModule { }
