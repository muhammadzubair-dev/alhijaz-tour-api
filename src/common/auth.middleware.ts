/* eslint-disable prettier/prettier */
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtService } from './jwt.service';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  async use(req: any, res: any, next: (error?: any) => void) {
    const headerAuth = req.headers['authorization'];
    const cookieAuth = req.cookies?.token;

    // Ambil token dari header > fallback ke cookie
    const token = headerAuth?.startsWith('Bearer ') ? headerAuth.slice(7) : headerAuth || cookieAuth;

    if (token) {
      try {
        const decoded = this.jwt.verify(token);
        const userId = decoded?.id;

        if (userId) {
          const redisKey = `auth_token:${userId}`;
          const redisToken = await this.redis.get(redisKey);

          if (redisToken === token) {
            const user = await this.prisma.users.findUnique({
              select: { id: true, username: true, name: true, type: true, isDefaultPassword: true },
              where: { id: userId },
            });

            if (user) {
              const userRoles = await this.prisma.user_roles.findMany({
                where: { user_id: userId },
                select: {
                  roles_id: true,
                  role: {
                    select: {
                      name: true,
                      role_menus: {
                        select: { menu_id: true },
                      },
                    },
                  },
                },
              });

              // Ambil semua menu_id dari seluruh role
              const menuIds = userRoles.flatMap((ur) => ur.role.role_menus.map((rm) => rm.menu_id));

              // Ambil nama role-nya
              const roleNames = userRoles.map((ur) => ur.role.name);

              // Simpan ke req.user
              req.user = { ...user, roleNames, menuIds: [...new Set(menuIds)] };
            }
          }
        }
      } catch (error) {
        this.logger.error(`JWT verification failed: ${error.message}`);
      }
    }

    next();
  }
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  type: string;
  isDefaultPassword: boolean;
  menuIds: string[];
  roleNames: string[];
}

