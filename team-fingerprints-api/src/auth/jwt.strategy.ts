import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';

dotenv.config();

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
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER,
      algorithms: ['RS256'],
    });
  }

  async validate({ sub }: authPayload): Promise<User | HttpException> {
    const user: User = await this.userService.getUserByAuthId(sub);
    if (user) {
      await this.authService.handleExistingUsers(user.email);
      return user;
    } else {
      return await this.authService.handleNewUsers(sub);
    }
  }
}
