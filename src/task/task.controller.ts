/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
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
    const result = await this.taskService.listTask(authUser, request, false);
    return result;
  }

  @Get('assigned')
  @HttpCode(HttpStatus.OK)
  async listTaskNotification(
    @Auth() authUser: users,
    @Query() request: ListTaskRequest,
  ): Promise<WebResponse<TaskResponse[]>> {
    const result = await this.taskService.listTask(authUser, request);
    return result;
  }

  @Patch('read')
  async markRead(
    @Auth() authUser: users,
    @Body('taskId') taskId: number,
  ): Promise<WebResponse<any>> {
    const result = await this.taskService.markTasksAsRead(authUser, taskId);
    return result
  }

  @Get(':taskId')
  @HttpCode(HttpStatus.OK)
  async getTaskDetail(
    @Auth() authUser: users,
    @Param('taskId') taskId: number,
  ): Promise<WebResponse<TaskResponse[]>> {
    const result = await this.taskService.getTaskDetail(authUser, taskId);
    return result;
  }

  @Patch(':taskId')
  @HttpCode(HttpStatus.OK)
  async updateTaskStatus(
    @Auth() authUser: users,
    @Param('taskId') taskId: number,
    @Body('newStatus') newStatus: string,
  ): Promise<WebResponse<TaskResponse[]>> {
    const result = await this.taskService.updateTaskStatus(authUser, taskId, newStatus);
    return result;
  }
}
