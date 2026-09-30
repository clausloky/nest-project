import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../auth/decorators/roles.decorator.js';
import { User } from '../entities/user.entity.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtiene los roles requeridos desde el decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // si no hay roles definidos, deja pasar
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // Verifica si el usuario tiene al menos uno de los roles requeridos
    return requiredRoles.some((role) => user?.userRoles?.includes(role));
  }

  matchRoles(roles: string[], userRoles: string[]) {
    let access = false;
    roles.forEach((userRole) => {
        if (roles.includes(userRole)) access = true;
    })
    return access;
  }
}
