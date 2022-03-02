import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/models/user.model';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

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
    private readonly configService: ConfigService,
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
    this.consol();
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

  consol() {
    console.log('dsdsdsdsdsd');
    console.log(this.configService.get('PORT'));
    console.log(this.configService.get('MONGODB_URI'));
    console.log(this.configService.get('AUTH0_MANAGEMENT_API_TOKEN'));
  }
}
