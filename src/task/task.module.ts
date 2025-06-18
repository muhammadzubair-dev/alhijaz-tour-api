import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SseService } from 'src/sse/sse.service';

@Module({
  providers: [TaskService, SseService],
  controllers: [TaskController],
})
// eslint-disable-next-line prettier/prettier
export class TaskModule { }
