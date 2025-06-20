/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { WebResponse } from 'src/common/dto/web.dto';
import { ListTaskRequest, TaskResponse } from './task.dto';
import { Auth } from 'src/common/auth.decorator';
import { users } from '@prisma/client';
import { Roles } from 'src/common/roles.decorator';
import { MENU_IDS } from 'src/common/constants/menu-ids.constant';
import { AuthUser } from 'src/common/auth.middleware';

@Controller('api/tasks')
export class TaskController {
  constructor(private taskService: TaskService) { }

  @Get()
  @Roles(MENU_IDS.TaskAllList)
  @HttpCode(HttpStatus.OK)
  async listTask(
    @Auth() authUser: users,
    @Query() request: ListTaskRequest,
  ): Promise<WebResponse<TaskResponse[]>> {
    const result = await this.taskService.listTask(authUser, request, false);
    return result;
  }

  @Get('assigned')
  @Roles(MENU_IDS.TaskMeList, MENU_IDS.Dashboard)
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

  @Get('role')
  @Roles(MENU_IDS.TaskRoleList)
  async listTaskRole(
    @Auth() _: users,
    @Query() query: any,
  ): Promise<WebResponse<any>> {
    const result = await this.taskService.listTaskRole(query);
    return result
  }

  @Patch('role/:taskTypeId')
  @Roles(MENU_IDS.TaskRoleEdit)
  async updateTaskTypeRole(
    @Auth() _: users,
    @Param('taskTypeId') taskTypeId: number,
    @Body('roleId') roleId: number,
  ): Promise<WebResponse<any>> {
    const result = await this.taskService.updateTaskTypeRole(taskTypeId, roleId);
    return result;
  }

  @Get(':taskId')
  @Roles(MENU_IDS.TaskMeList, MENU_IDS.TaskAllList)
  @HttpCode(HttpStatus.OK)
  async getTaskDetail(
    @Auth() authUser: AuthUser,
    @Param('taskId') taskId: number,
  ): Promise<WebResponse<TaskResponse[]>> {
    const result = await this.taskService.getTaskDetail(authUser, taskId);
    return result;
  }

  @Patch('/assigned/:taskId')
  @Roles(MENU_IDS.TaskMeStatus)
  @HttpCode(HttpStatus.OK)
  async updateTaskStatusAssigned(
    @Auth() authUser: users,
    @Param('taskId') taskId: number,
    @Body('newStatus') newStatus: string,
  ): Promise<WebResponse<TaskResponse[]>> {
    const result = await this.taskService.updateTaskStatus(authUser, taskId, newStatus);
    return result;
  }


  @Patch(':taskId')
  @Roles(MENU_IDS.TaskAllStatus)
  @HttpCode(HttpStatus.OK)
  async updateTaskStatus(
    @Auth() authUser: users,
    @Param('taskId') taskId: number,
    @Body('newStatus') newStatus: string,
  ): Promise<WebResponse<TaskResponse[]>> {
    const result = await this.taskService.updateTaskStatus(authUser, taskId, newStatus, false);
    return result;
  }
}
