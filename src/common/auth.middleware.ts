/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService
  ) { }

  async use(req: any, res: any, next: (error?: any) => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    const decoded = this.jwt.verify(token);
    const userId = decoded.id;
    if (!userId) {
      return next();
    }

    const redisKey = `auth_token:${userId}`;
    const redisToken = await this.redis.get(redisKey);

    if (redisToken && redisToken === token) {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  }
}
