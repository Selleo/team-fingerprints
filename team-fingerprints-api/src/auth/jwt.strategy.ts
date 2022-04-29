import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { UserModel } from 'src/users/models/user.model';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

interface authPayload {
  iss: string;
  sub: string;
  aud: [string, string];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>(
          'AUTH0_DOMAIN',
        )}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('AUTH0_AUDIENCE'),
      issuer: configService.get<string>('AUTH0_ISSUER'),
      algorithms: ['RS256'],
    });
  }

  async validate({ sub }: authPayload): Promise<UserModel | HttpException> {
    const user: UserModel = await this.userService.getUserByAuthId(sub);
    if (user) {
      await this.authService.handleExistingUsers(user.email);
      return user;
    } else {
      return await this.authService.handleNewUsers(sub);
    }
  }
}
