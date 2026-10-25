import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
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
    let token = this.extractTokenFromHeader(request);

    if (!token) {
      token = request.cookies?.token;

      if (!token) throw new UnauthorizedException("No token");
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: JWT_KEY,
      });

      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new UnauthorizedException('Token expirado');
      }

      request.user = payload;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 
