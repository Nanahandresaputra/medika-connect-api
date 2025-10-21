import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config } from 'src/config/config';
import { IS_PUBLIC_KEY } from './auth.decorator';
import { PrismaService } from 'src/prisma-connect/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tokenData = this.extractTokenFromHeader(request);

    console.log('token data --->', tokenData);

    if (!tokenData) {
      throw new UnauthorizedException();
    }
    try {
      const authData = await this.prisma.auth.findUnique({
        where: { token: tokenData },
      });

      if (!authData) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync(tokenData, {
        secret: config.key,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
