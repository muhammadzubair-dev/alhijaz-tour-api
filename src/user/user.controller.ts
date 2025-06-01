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
  ListUserMenuRequest,
  ListUserRequest,
  ListUserRoleRequest,
  RegisterUserRequest,
  RegisterUserRoleRequest,
  UserMenuResponse,
  UserResponse,
  UserRoleResponse,
} from 'src/common/dto/user.dto';
import { WebResponse } from 'src/common/dto/web.dto';
import { UserService } from './user.service';
import {
  UserSwaggerDeactivate,
  UserSwaggerList,
  UserSwaggerRegister,
  UserSwaggerUpdate,
} from './user.swagger';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) { }

  // POST /api/users
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

  // GET /api/users
  @Get()
  @UserSwaggerList()
  @HttpCode(HttpStatus.OK)
  async listUser(
    @Query() request: ListUserRequest,
  ): Promise<WebResponse<UserResponse[]>> {
    const result = await this.userService.listUser(request);
    return result;
  }

  // PATCH /api/users/:id/deactivate
  @Patch(':id/deactivate')
  @UserSwaggerDeactivate()
  @HttpCode(HttpStatus.OK)
  async deactivateUser(@Param('id') id: string) {
    return this.userService.deactivateUser(id);
  }

  // PATCH /api/users/:id
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

  // GET /api/users/menu
  @Get('menus')
  @HttpCode(HttpStatus.OK)
  async listUserMenu(
    @Query() request: ListUserMenuRequest,
  ): Promise<WebResponse<UserMenuResponse[]>> {
    const result = await this.userService.listUserMenu(request);
    return result;
  }

  // POST /api/users/role
  @Post('role')
  @HttpCode(HttpStatus.CREATED)
  async registerRole(
    @Body() request: RegisterUserRoleRequest,
  ): Promise<WebResponse<UserRoleResponse>> {
    const result = await this.userService.registerRole(request);
    return {
      data: result,
    };
  }

  // GET /api/users/roles
  @Get('roles')
  @HttpCode(HttpStatus.OK)
  async listUserRole(
    @Query() request: ListUserRoleRequest,
  ): Promise<WebResponse<UserRoleResponse[]>> {
    const result = await this.userService.listUserRole(request);
    return result;
  }

  // PATCH /api/users/role/:id
  @Patch('role/:id')
  @HttpCode(HttpStatus.OK)
  async updateUserRole(
    @Param('id') id: number,
    @Body() request: Partial<RegisterUserRoleRequest>,
  ): Promise<WebResponse<UserRoleResponse>> {
    const result = await this.userService.updateUserRole(id, request);
    return {
      data: result,
    };
  }

  // DELETE /api/users/role/:id
  @Delete('role/:id')
  @HttpCode(HttpStatus.OK)
  deleteRole(@Param('id') id: number): Promise<{ message: string }> {
    return this.userService.deleteUserRole(id);
  }
}
