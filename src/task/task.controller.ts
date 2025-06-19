/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { WebResponse } from 'src/common/dto/web.dto';
import { ListTaskRequest, TaskResponse } from './task.dto';
import { Auth } from 'src/common/auth.decorator';
import { users } from '@prisma/client';

@Controller('api/tasks')
export class TaskController {
  constructor(private taskService: TaskService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listTask(
    @Auth() authUser: users,
    @Query() request: ListTaskRequest,
  ): Promise<WebResponse<TaskResponse[]>> {
    const result = await this.taskService.listTask(authUser, request);
    return result;
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test() {
    const result = await this.taskService.sendTestNotification(
      'a0953db2-0a18-432b-8eec-a075a9ee2794',
      { wadidaw: 'Mantapppppppp' }
    );
    return result;
  }
}
