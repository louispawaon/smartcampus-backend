import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from './dto/role.dto';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

export class TokenDto {
  id: number;
  role: Role;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }
    const token = authHeader.split(' ')[1];

    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!payload || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const userRole: Role = payload.role;

    const isAuthorized = requiredRoles.some((role) => role === userRole);
    if (!isAuthorized) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true;
  }
}
