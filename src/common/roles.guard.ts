import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // tidak butuh permission khusus
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.menuIds) {
      throw new ForbiddenException('Access denied. No user or menu info.');
    }

    // Cek apakah user punya salah satu permission
    const hasPermission = requiredPermissions.some((permission) =>
      user.menuIds.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'Access denied. Missing required permission.',
      );
    }

    return true;
  }
}
