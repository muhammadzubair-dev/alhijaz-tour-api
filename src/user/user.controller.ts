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
  Put,
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
  ChangePasswordRequest,
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
import { Roles } from 'src/common/roles.decorator';
import { MENU_IDS } from 'src/common/constants/menu-ids.constant';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) { }

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

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Auth() user: users,
    @Body() request: ChangePasswordRequest,
  ): Promise<WebResponse<{ message: string }>> {
    await this.userService.changePassword(user.id, request);
    return {
      data: {
        message: 'Password berhasil diubah',
      },
    };
  }

  @Post('logout')
  async logout(
    @Auth() user: users,
  ): Promise<WebResponse<{ message: string }>> {
    await this.userService.logoutUser(user?.id);
    return {
      data: { message: 'Logout berhasil' }
    };
  }

  @Get('current')
  @HttpCode(HttpStatus.OK)
  async currentUser(
    @Auth() user: users,
  ): Promise<WebResponse<any>> {
    return { data: user };
  }

  @Post()
  @Roles(MENU_IDS.StaffAdd)
  @UserSwaggerRegister()
  @HttpCode(HttpStatus.CREATED)
  async registerUser(
    @Auth() user: users,
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.registerUser(request, user);
    return {
      data: result,
    };
  }

  @Get()
  @Roles(MENU_IDS.StaffList)
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
  async deactivateUser(
    @Auth() _: users,
    @Param('id') id: string
  ) {
    return this.userService.deactivateUser(id);
  }

  @Patch(':id')
  @Roles(MENU_IDS.StaffEdit)
  @UserSwaggerUpdate()
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Auth() user: users,
    @Param('id') id: string,
    @Body() request: Partial<RegisterUserRequest>,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.updateUser(id, request, user);
    return {
      data: result,
    };
  }

  @Delete(':id')
  @Roles(MENU_IDS.StaffDelete)
  @HttpCode(HttpStatus.OK)
  async dele(
    @Auth() user: users,
    @Param('id') id: string,
  ): Promise<WebResponse<{ message: string, username: string }>> {
    const result = await this.userService.deleteUser(user, id);
    return {
      data: result,
    };
  }

  // Menu
  @Get('menus')
  @HttpCode(HttpStatus.OK)
  async listMenu(
    @Auth() _: users,
    @Query() request: ListMenuRequest,
  ): Promise<WebResponse<MenuResponse[]>> {
    const result = await this.userService.listMenu(request);
    return result;
  }

  // Role
  @Post('role')
  @Roles(MENU_IDS.RoleAdd)
  @HttpCode(HttpStatus.CREATED)
  async registerRole(
    @Auth() user: users,
    @Body() request: RegisterRoleRequest,
  ): Promise<WebResponse<RoleResponse>> {
    const result = await this.userService.registerRole(request, user);
    return {
      data: result,
    };
  }

  @Get('roles')
  @Roles(MENU_IDS.RoleList)
  @HttpCode(HttpStatus.OK)
  async listRole(
    @Auth() _: users,
    @Query() request: ListRoleRequest,
  ): Promise<WebResponse<RoleResponse[]>> {
    const result = await this.userService.listRole(request);
    return result;
  }

  @Patch('role/:id')
  @Roles(MENU_IDS.RoleEdit)
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Auth() user: users,
    @Param('id') id: number,
    @Body() request: Partial<RegisterRoleRequest>,
  ): Promise<WebResponse<RoleResponse>> {
    const result = await this.userService.updateRole(id, request, user);
    return {
      data: result,
    };
  }

  @Delete('role/:id')
  @Roles(MENU_IDS.RoleDelete)
  @HttpCode(HttpStatus.OK)
  async deleteRole(
    @Auth() _: users,
    @Param('id') id: number
  ): Promise<{ message: string }> {
    return this.userService.deleteRole(id);
  }

  @Post('role/:roleId/menu')
  // @Roles(MENU_IDS.RoleMenu)
  @HttpCode(HttpStatus.OK)
  async updateRoleMenu(
    @Auth() user: users,
    @Param('roleId') roleId: number,
    @Body() request: { data: string[] },
  ): Promise<WebResponse<any>> {
    const result = await this.userService.updateRoleMenu(roleId, request.data, user);
    return {
      data: result,
    };
  }

  // Agent
  @Post('agent')
  @Roles(MENU_IDS.AgentAdd)
  @HttpCode(HttpStatus.CREATED)
  async registerAgent(
    @Auth() user: users,
    @Body() request: RegisterAgentRequest,
  ): Promise<WebResponse<{ message: string }>> {
    const result = await this.userService.registerAgent(request, user);
    return {
      data: result
    }
  }

  @Put('agent/:id')
  @Roles(MENU_IDS.AgentEdit)
  @HttpCode(HttpStatus.OK)
  async updateAgent(
    @Auth() user: users,
    @Param('id') id: number,
    @Body() request: Partial<RegisterAgentRequest>,
  ): Promise<WebResponse<{ message: string }>> {
    const result = await this.userService.updateAgent(user, id, request);
    return {
      data: result,
    };
  }

  @Delete('agent/:id')
  @Roles(MENU_IDS.AgentDelete)
  @HttpCode(HttpStatus.OK)
  async deleteAgent(
    @Auth() user: users,
    @Param('id') id: number,
  ): Promise<WebResponse<{ message: string, username: string }>> {
    const result = await this.userService.deleteAgent(user, id);
    return {
      data: result,
    };
  }

  @Get('agents')
  @Roles(MENU_IDS.AgentList)
  @HttpCode(HttpStatus.OK)
  async listAgent(
    @Auth() _: users,
    @Query() request: ListAgentRequest,
  ): Promise<WebResponse<AgentResponse[]>> {
    const result = await this.userService.listAgent(request);
    return result;
  }
}
