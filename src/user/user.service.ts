/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as generatePassword from 'generate-password';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  AgentResponse,
  ListAgentRequest,
  ListMenuRequest,
  ListRoleRequest,
  ListUserRequest,
  LoginUserRequest,
  MenuResponse,
  RegisterAgentRequest,
  RegisterRoleRequest,
  RegisterUserRequest,
  RoleResponse,
  UserResponse
} from 'src/common/dto/user.dto';
import { WebResponse } from 'src/common/dto/web.dto';
import { JwtService } from 'src/common/jwt.service';
import { PrismaService } from 'src/common/prisma.service';
import { RedisService } from 'src/common/redis.service';
import { camelToSnakeCase } from 'src/common/utils/camelToSnakeCase';
import { Logger } from 'winston';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService
  ) { }

  // User
  async registerUser(request: RegisterUserRequest, authUser: users): Promise<UserResponse> {
    this.logger.info(`Registering new user: ${request.username}`);

    const existingUser = await this.prisma.users.findFirst({
      where: { username: request.username },
    });

    if (existingUser) {
      this.logger.warn(`Username already exists: ${request.username}`);
      throw new BadRequestException('Username already exists');
    }

    const randomPassword = generatePassword.generate({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = await this.prisma.users.create({
      data: {
        username: request.username,
        name: request.name,
        isActive: request.isActive,
        type: request.type,
        password: hashedPassword,
        created_by: authUser.id,
        updated_by: null,
        updated_at: null
      },
    });

    this.logger.info(`User registered: ${user.username}`);

    return {
      username: user.username,
      name: user.name,
      password: randomPassword,
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

    const where: any = {
      ...(username && {
        username: { contains: username, mode: 'insensitive' },
      }),
      ...(name && {
        name: { contains: name, mode: 'insensitive' },
      }),
      ...(type !== undefined && { type }),
      ...(isActive !== undefined && { isActive }),
      isDeleted: false, // hanya ambil data yang belum dihapus
    };

    const total = await this.prisma.users.count({ where });
    const totalPages = Math.ceil(total / limit);

    let orderBy: any = { created_at: 'desc' }; // default sorting

    if (sortBy) {
      orderBy = {
        [sortBy]: sortOrder ?? 'asc',
      };
    }

    const users = await this.prisma.users.findMany({
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where,
      orderBy,
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
        createdBy: user.createdByUser?.name || '-',
        createdAt: user.created_at,
        updatedBy: user.updatedByUser?.name || '-',
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
    authUser: users
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
    // const isSameData =
    //   (payload.username ?? existingUser.username) === existingUser.username &&
    //   (payload.name ?? existingUser.name) === existingUser.name
    // // (payload.type ?? existingUser.type) === existingUser.type;

    // if (isSameData) {
    //   throw new BadRequestException(
    //     'No changes detected in the update request',
    //   );
    // }

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: {
        username: payload.username ?? existingUser.username,
        name: payload.name ?? existingUser.name,
        type: payload.type ?? existingUser.type,
        updated_by: authUser.id,
        updated_at: new Date()
      },
    });

    return {
      username: updatedUser.username,
      name: updatedUser.name,
      type: updatedUser.type,
    };
  }

  async loginUser(request: LoginUserRequest): Promise<{ token: string }> {
    const { username, password } = request
    const user = await this.prisma.users.findFirst({
      where: { username },
    });

    if (!user) {
      this.logger.warn(`Login failed. User not found: ${username}`);
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed. Invalid password for user: ${username}`);
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { id: user.id }
    const token = this.jwt.sign(payload)

    await this.redis.set(`auth_token:${user.id}`, token);

    return { token }
  }

  async deleteUser(authUser: users, id: string): Promise<{ message: string; username: string }> {
    const existingUser = await this.prisma.users.findUnique({
      where: { id },
      select: {
        username: true,
        isDeleted: true,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (existingUser.isDeleted) {
      throw new BadRequestException(`User with ID ${id} is already deleted`);
    }

    await this.prisma.users.update({
      where: { id },
      data: {
        isDeleted: true,
        updated_by: authUser.id,
        updated_at: new Date(),
      },
    });

    return {
      message: `User with ID ${id} has been successfully soft-deleted.`,
      username: existingUser.username,
    };
  }

  // Menu
  async listMenu(
    request: ListMenuRequest,
  ): Promise<WebResponse<MenuResponse[]>> {
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

  // Role
  async listRole(
    request: ListRoleRequest,
  ): Promise<WebResponse<RoleResponse[]>> {
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
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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
        createdBy: role.createdByUser?.name || '-',
        createdAt: role.created_at,
        updatedBy: role.updatedByUser?.name || '-',
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

  async registerRole(request: RegisterRoleRequest, authUser: users): Promise<RoleResponse> {
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
        created_by: authUser.id,
        updated_by: null,
        updated_at: null
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

  async updateRole(
    roleId: number,
    payload: Partial<RegisterRoleRequest>,
    authUser: users
  ): Promise<RoleResponse> {
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
        updated_by: authUser.id,
        updated_at: new Date()
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

  async deleteRole(id: number): Promise<{ message: string }> {
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

  // Agent
  async listAgent(
    request: ListAgentRequest,
  ): Promise<WebResponse<AgentResponse[]>> {
    const {
      name,
      phone,
      email,
      isActive,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = request;

    const where: any = {
      ...(name && {
        user: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      }),
      ...(phone && {
        phone: {
          contains: phone,
          mode: 'insensitive',
        },
      }),
      ...(email && {
        email: {
          contains: email,
          mode: 'insensitive',
        },
      }),
      ...(isActive !== undefined && { isActive }),
      isDeleted: false,
    };

    const total = await this.prisma.agents.count({ where });
    const totalPages = Math.ceil(total / limit);

    let orderBy: any = { created_at: 'desc' };

    if (sortBy) {
      if (['name', 'username'].includes(sortBy)) {
        orderBy = {
          user: {
            [sortBy]: sortOrder ?? 'asc',
          },
        };
      } else if (sortBy === 'bankName') {
        orderBy = {
          bank: {
            name: sortOrder ?? 'asc',
          },
        };
      } else {
        orderBy = {
          [camelToSnakeCase(sortBy, ['isActive'])]: sortOrder ?? 'asc',
        };
      }
    }

    const agents = await this.prisma.agents.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true
          },
        },
        bank: {
          select: {
            id: true,
            name: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: agents.map((agent) => ({
        id: agent.id,
        userId: agent.user.id,
        username: agent.user.username,
        name: agent.user.name,
        identityType: agent.identity_type,
        bankId: agent.bank.id,
        bankName: agent.bank.name,
        accountNumber: agent.account_number,
        phone: agent.phone,
        email: agent.email,
        balance: agent.balance,
        address: agent.address,
        leadId: agent.lead_id,
        coordinatorId: agent.coordinator_id,
        targetRemaining: agent.target_remaining,
        isActive: agent.isActive,
        createdBy: agent.createdByUser?.name || null,
        createdAt: agent.created_at,
        updatedBy: agent.updatedByUser?.name || null,
        updatedAt: agent.updated_at,
      })),
      paging: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async registerAgent(request: RegisterAgentRequest, authUser: users): Promise<{ message: string; username: string; password: string }> {
  this.logger.info(`Registering new agent: ${request.username}`);

  const existingUser = await this.prisma.users.findFirst({
    where: { username: request.username },
  });

  if (existingUser) {
    this.logger.warn(`Username already exists: ${request.username}`);
    throw new BadRequestException('Username already exists');
  }

  const randomPassword = generatePassword.generate({
    length: 10,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    strict: true,
  });
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  await this.prisma.$transaction(async (tx) => {
    // 1. Create user
    const user = await tx.users.create({
      data: {
        username: request.username,
        name: request.name,
        isActive: request.isActive,
        type: '1', // langsung type 'agent'
        password: hashedPassword,
        created_by: authUser.id,
        updated_by: null,
        updated_at: null,
      },
    });

    // 2. Create agent with the new user ID
    await tx.agents.create({
      data: {
        user_id: user.id,
        identity_type: request.identityType,
        bank_id: request.bankId,
        account_number: request.accountNumber,
        phone: request.phone,
        email: request.email,
        balance: 0,
        address: request.address,
        lead_id: request.leadId,
        coordinator_id: request.coordinatorId,
        target_remaining: 0,
        isActive: request.isActive,
        created_by: authUser.id,
        updated_by: null,
        updated_at: null,
      },
    });
  });

  this.logger.info(`Agent registered: ${request.username}`);
  return {
    message: `Agent registered: ${request.username}`,
    username: request.username,
    password: randomPassword,
  };
}

  async updateAgent(authUser: users, id: number, request: RegisterAgentRequest): Promise<{ message: string }> {
    const existingAgent = await this.prisma.agents.findUnique({ where: { id } });

    if (!existingAgent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.agents.update({
        where: { id },
        data: {
          identity_type: request.identityType,
          bank_id: request.bankId,
          account_number: request.accountNumber,
          phone: request.phone,
          email: request.email,
          address: request.address,
          lead_id: request.leadId,
          coordinator_id: request.coordinatorId,
          isActive: request.isActive,
          updated_by: authUser.id,
          updated_at: new Date(),
        },
      });
    });

    return { message: `Agent updated: ${id}` };
  }

  async deleteAgent(authUser: users, id: number): Promise<{ message: string; username: string }> {
    const existingAgent = await this.prisma.agents.findUnique({
      where: { id },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    if (!existingAgent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    if ((existingAgent as any).isDeleted) {
      throw new BadRequestException(`Agent with ID ${id} already deleted`);
    }

    await this.prisma.agents.update({
      where: { id },
      data: {
        isDeleted: true,
        updated_by: authUser.id,
        updated_at: new Date(),
      },
    });

    return {
      message: `Agent with ID ${id} has been successfully soft-deleted`,
      username: existingAgent.user.username,
    };
  }

}
