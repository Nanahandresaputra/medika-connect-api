import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AppAbility,
  CaslAbilityFactory,
} from './casl-ability.factory/casl-ability.factory';
import { PolicyHandler } from './interfaces/policies.interface';
import { CHECK_POLICIES_KEY } from './policies.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config/config';
import { UserLogin } from './policies.entity';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();

    const tokenData = this.extractTokenFromHeader(request);

    if (!tokenData) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(tokenData, {
        secret: config.key,
      });
      //   request['user'] = payload;

      const user: UserLogin = payload;

      const ability = this.caslAbilityFactory.createForUser(user);

      return policyHandlers.every((handler) =>
        this.execPolicyHandler(handler, ability),
      );
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
