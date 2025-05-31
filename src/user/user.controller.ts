import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ListUserRequest,
  RegisterUserRequest,
  UserResponse,
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
  constructor(private userService: UserService) {}

  // POST /api/users
  @Post()
  @UserSwaggerRegister()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);
    return {
      data: result,
    };
  }

  // GET /api/users
  @Get()
  @UserSwaggerList()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query() request: ListUserRequest,
  ): Promise<WebResponse<UserResponse[]>> {
    const result = await this.userService.list(request);
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
}
