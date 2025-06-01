/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ListAgentRequest,
  ListMenuRequest,
  ListUserRequest,
  ListRoleRequest,
  RegisterUserRequest,
  RegisterRoleRequest,
  AgentResponse,
  MenuResponse,
  UserResponse,
  RoleResponse,
  RegisterAgentRequest,
  LoginUserRequest,
} from 'src/common/dto/user.dto';
import { WebResponse } from 'src/common/dto/web.dto';
import { UserService } from './user.service';
import {
  UserSwaggerDeactivate,
  UserSwaggerList,
  UserSwaggerRegister,
  UserSwaggerUpdate,
} from './user.swagger';
import { Auth } from 'src/common/auth.decorator';
import { users } from '@prisma/client';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) { }

  // User
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async loginUser(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<{ token: string }>> {
    const result = await this.userService.loginUser(request);
    return {
      data: result,
    };
  }

  @Post()
  @UserSwaggerRegister()
  @HttpCode(HttpStatus.CREATED)
  async registerUser(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.registerUser(request);
    return {
      data: result,
    };
  }

  @Get()
  @UserSwaggerList()
  @HttpCode(HttpStatus.OK)
  async listUser(
    @Auth() _: users,
    @Query() request: ListUserRequest,
  ): Promise<WebResponse<UserResponse[]>> {
    const result = await this.userService.listUser(request);
    return result;
  }

  @Patch(':id/deactivate')
  @UserSwaggerDeactivate()
  @HttpCode(HttpStatus.OK)
  async deactivateUser(@Param('id') id: string) {
    return this.userService.deactivateUser(id);
  }

  @Patch(':id')
  @UserSwaggerUpdate()
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() request: Partial<RegisterUserRequest>,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.updateUser(id, request);
    return {
      data: result,
    };
  }

  // Menu
  @Get('menus')
  @HttpCode(HttpStatus.OK)
  async listMenu(
    @Query() request: ListMenuRequest,
  ): Promise<WebResponse<MenuResponse[]>> {
    const result = await this.userService.listMenu(request);
    return result;
  }

  // Role
  @Post('role')
  @HttpCode(HttpStatus.CREATED)
  async registerRole(
    @Body() request: RegisterRoleRequest,
  ): Promise<WebResponse<RoleResponse>> {
    const result = await this.userService.registerRole(request);
    return {
      data: result,
    };
  }

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  async listRole(
    @Query() request: ListRoleRequest,
  ): Promise<WebResponse<RoleResponse[]>> {
    const result = await this.userService.listRole(request);
    return result;
  }

  @Patch('role/:id')
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Param('id') id: number,
    @Body() request: Partial<RegisterRoleRequest>,
  ): Promise<WebResponse<RoleResponse>> {
    const result = await this.userService.updateRole(id, request);
    return {
      data: result,
    };
  }

  @Delete('role/:id')
  @HttpCode(HttpStatus.OK)
  async deleteRole(@Param('id') id: number): Promise<{ message: string }> {
    return this.userService.deleteRole(id);
  }

  // User Agent
  @Post('agent')
  @HttpCode(HttpStatus.CREATED)
  async registerAgent(
    @Body() request: RegisterAgentRequest,
  ): Promise<{ message: string }> {
    const result = await this.userService.registerAgent(request);
    return result

  }

  @Get('agents')
  @HttpCode(HttpStatus.OK)
  async listAgent(
    @Query() request: ListAgentRequest,
  ): Promise<WebResponse<AgentResponse[]>> {
    const result = await this.userService.listAgent(request);
    return result;
  }
}
