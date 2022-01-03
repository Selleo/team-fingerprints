import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import * as jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'util';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // if (!this.configService.get<string>('AUTH_ENABLED')) return true; //DEV AUTH ENABLED

    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;
    const AUTH0_DOMAIN = this.configService.get<string>('AUTH0_DOMAIN');
    // const AUTH0_AUDIENCE = this.configService.get<string>('AUTH0_AUDIENCE');

    const checkJwt = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${AUTH0_DOMAIN}.well-known/jwks.json`,
        }),
        // audience: AUTH0_AUDIENCE,
        issuer: AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );

    try {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getRequest<Response>();
      await checkJwt(request, response);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
