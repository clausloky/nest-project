import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_KEY } from '../constants/jwt.constants.js';

interface JwtPayload {
  sub: string;       // ID del usuario
  username: string;  // nombre de usuario
  roles?: string[];  // roles opcionales
  iat?: number;      // issued at
  exp?: number;      // expiration
}

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: JWT_KEY,
      });

      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new UnauthorizedException('Token expirado');
      }

      if (payload.roles && !payload.roles.includes('admin')) {
        throw new ForbiddenException('No tienes permisos suficientes');
      }

      request.user = payload;
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 
