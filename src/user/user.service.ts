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
  ListUserRequest,
  RegisterUserRequest,
  UserResponse,
} from 'src/common/dto/user.dto';
import { WebResponse } from 'src/common/dto/web.dto';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
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

  async list(request: ListUserRequest): Promise<WebResponse<UserResponse[]>> {
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
}
