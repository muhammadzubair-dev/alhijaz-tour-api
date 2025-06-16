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
    const authHeader = req.headers['authorization'];

    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

      try {
        const decoded = this.jwt.verify(token);
        const userId = decoded?.id;

        if (userId) {
          const redisKey = `auth_token:${userId}`;
          const redisToken = await this.redis.get(redisKey);

          if (redisToken === token) {
            const user = await this.prisma.users.findUnique({
              select: {
                id: true,
                username: true,
                name: true,
                type: true,
              },
              where: { id: userId },
            });

            if (user) {
              // 🔍 Ambil semua role_id milik user
              const userRoles = await this.prisma.user_roles.findMany({
                where: { user_id: userId },
                select: {
                  roles_id: true,
                  role: {
                    select: {
                      role_menus: {
                        select: { menu_id: true },
                      },
                    },
                  },
                },
              });

              // 🔄 Ambil semua menu_id dari role_menus
              const menuIds = userRoles
                .flatMap((ur) => ur.role.role_menus.map((rm) => rm.menu_id));
              const uniqueMenuIds = [...new Set(menuIds)];

              // ✅ Tempel menuIds ke user
              req.user = {
                ...user,
                menuIds: uniqueMenuIds,
              };
            }
          }
        }
      } catch (error) {
        this.logger.error(`JWT verification failed: ${error.message}`);
        // optionally: res.status(401).json({ message: 'Invalid token' });
      }
    }

    next(); // ⚠️ pastikan tetap dipanggil
  }
}
