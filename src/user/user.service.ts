/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
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
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) { }

  // User
  async registerUser(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Registering new user: ${request.username}`);

    const existingUser = await this.prisma.users.findFirst({
      where: { username: request.username },
    });

    if (existingUser) {
      this.logger.warn(`Username already exists: ${request.username}`);
      throw new BadRequestException('Username already exists');
    }

    const generatedPassword = nanoid(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const user = await this.prisma.users.create({
      data: {
        username: request.username,
        name: request.name,
        type: request.type,
        password: hashedPassword,
      },
    });

    this.logger.info(`User registered: ${user.username}`);

    return {
      username: user.username,
      name: user.name,
      password: generatedPassword,
    };
  }

  async listUser(
    request: ListUserRequest,
  ): Promise<WebResponse<UserResponse[]>> {
    const {
      username,
      name,
      type,
      isActive,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = request;

    const where = Object.fromEntries(
      Object.entries({
        username: username
          ? { contains: username, mode: 'insensitive' }
          : undefined,
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        type: type !== undefined ? type : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).filter(([_, value]) => value !== undefined),
    );

    const total = await this.prisma.users.count({ where });
    const totalPages = Math.ceil(total / limit);

    const users = await this.prisma.users.findMany({
      where,
      orderBy: sortBy
        ? {
          [sortBy]: sortOrder ?? 'asc',
        }
        : undefined,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users.map((user) => ({
        id: user.id,
        username: user.username,
        name: user.name,
        bannedUntil: user.banned_until,
        isDefaultPassword: user.isDefaultPassword,
        isActive: user.isActive,
        type: user.type,
        createdBy: user.created_by,
        createdAt: user.created_at,
        updatedBy: user.updated_by,
        updatedAt: user.updated_at,
      })),
      paging: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async deactivateUser(userId: string): Promise<{ message: string }> {
    const existingUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!existingUser.isActive) {
      throw new BadRequestException('User is already inactive');
    }

    await this.prisma.users.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return { message: `User with ID ${userId} has been deactivated` };
  }

  async updateUser(
    userId: string,
    payload: Partial<RegisterUserRequest>,
  ): Promise<UserResponse> {
    const existingUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validasi jika username ingin diubah dan sudah dipakai oleh user lain
    if (payload.username && payload.username !== existingUser.username) {
      const usernameTaken = await this.prisma.users.findFirst({
        where: {
          username: payload.username,
          NOT: { id: userId },
        },
      });

      if (usernameTaken) {
        throw new BadRequestException(
          'Username already in use by another user',
        );
      }
    }

    // Cek apakah payload berbeda dengan data existing
    const isSameData =
      (payload.username ?? existingUser.username) === existingUser.username &&
      (payload.name ?? existingUser.name) === existingUser.name &&
      (payload.type ?? existingUser.type) === existingUser.type;

    if (isSameData) {
      throw new BadRequestException(
        'No changes detected in the update request',
      );
    }

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: {
        username: payload.username ?? existingUser.username,
        name: payload.name ?? existingUser.name,
        type: payload.type ?? existingUser.type,
      },
    });

    return {
      username: updatedUser.username,
      name: updatedUser.name,
      type: updatedUser.type,
    };
  }

  // User Menu
  async listUserMenu(
    request: ListUserMenuRequest,
  ): Promise<WebResponse<UserMenuResponse[]>> {
    const { name, sortBy, sortOrder, page = 1, limit = 10 } = request;

    const where = Object.fromEntries(
      Object.entries({
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
      }).filter(([_, value]) => value !== undefined),
    );

    const total = await this.prisma.menus.count({ where });
    const totalPages = Math.ceil(total / limit);

    const menus = await this.prisma.menus.findMany({
      where,
      orderBy: sortBy
        ? {
          [sortBy]: sortOrder ?? 'asc',
        }
        : undefined,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: menus.map((menu) => ({
        id: menu.id,
        name: menu.name,
        desc: menu.desc,
        createdBy: menu.created_by,
        createdAt: menu.created_at,
        updatedBy: menu.updated_by,
        updatedAt: menu.updated_at,
      })),
      paging: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  // User Role
  async listUserRole(
    request: ListUserRoleRequest,
  ): Promise<WebResponse<UserRoleResponse[]>> {
    const {
      name,
      description,
      type,
      platform,
      isActive,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = request;

    const where = Object.fromEntries(
      Object.entries({
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        description: description ? { contains: description, mode: 'insensitive' } : undefined,
        type: type !== undefined ? type : undefined,
        platform: platform !== undefined ? platform : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      }).filter(([_, value]) => value !== undefined),
    );

    const total = await this.prisma.roles.count({ where });
    const totalPages = Math.ceil(total / limit);

    const roles = await this.prisma.roles.findMany({
      where,
      orderBy: sortBy
        ? {
          [sortBy]: sortOrder ?? 'asc',
        }
        : undefined,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        type: role.type,
        platform: role.platform,
        isActive: role.isActive,
        createdBy: role.created_by,
        createdAt: role.created_at,
        updatedBy: role.updated_by,
        updatedAt: role.updated_at,
      })),
      paging: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async registerRole(request: RegisterUserRoleRequest): Promise<UserRoleResponse> {
    this.logger.info(`Registering new role: ${request.name}`);

    const existingRole = await this.prisma.roles.findFirst({
      where: { name: request.name },
    });

    if (existingRole) {
      this.logger.warn(`Role already exists: ${request.name}`);
      throw new BadRequestException('Role name already exists');
    }

    const role = await this.prisma.roles.create({
      data: {
        name: request.name,
        description: request.description || '-',
        platform: request.platform,
        type: request.type,
        isActive: request.isActive,
      },
    });

    this.logger.info(`Role registered: ${role.name}`);

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      type: role.type,
      platform: role.platform
    };
  }

  async updateUserRole(
    roleId: number,
    payload: Partial<RegisterUserRoleRequest>,
  ): Promise<UserRoleResponse> {
    const existingUser = await this.prisma.roles.findUnique({
      where: { id: roleId },
    });

    if (!existingUser) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Validasi jika role name ingin diubah dan sudah dipakai oleh user lain
    if (payload.name && payload.name !== existingUser.name) {
      const usernameTaken = await this.prisma.roles.findFirst({
        where: {
          name: payload.name,
          NOT: { id: roleId },
        },
      });

      if (usernameTaken) {
        throw new BadRequestException(
          'Username already in use by another user',
        );
      }
    }

    // Cek apakah payload berbeda dengan data existing
    const isSameData =
      (payload.name ?? existingUser.name) === existingUser.name &&
      (payload.description ?? existingUser.description) === existingUser.description &&
      (payload.platform ?? existingUser.platform) === existingUser.platform &&
      (payload.type ?? existingUser.type) === existingUser.type &&
      (payload.isActive ?? existingUser.isActive) === existingUser.isActive;

    if (isSameData) {
      if (isSameData) {
        throw new BadRequestException(
          'No changes detected in the update request',
        );
      }


    }

    const updatedRole = await this.prisma.roles.update({
      where: { id: roleId },
      data: {
        name: payload.name ?? existingUser.name,
        description: payload.description ?? existingUser.description,
        platform: payload.platform ?? existingUser.platform,
        type: payload.type ?? existingUser.type,
        isActive: payload.isActive ?? existingUser.isActive,
      },
    });

    return {
      id: roleId,
      name: updatedRole.name,
      description: updatedRole.description,
      platform: updatedRole.platform,
      type: updatedRole.type,
      isActive: updatedRole.isActive,
    };
  }

  async deleteUserRole(id: number): Promise<{ message: string }> {
    const existingRole = await this.prisma.roles.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    await this.prisma.roles.delete({
      where: { id },
    });

    return { message: `Role with ID ${id} deleted successfully.` };
  }
}
