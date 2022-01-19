import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import * as request from 'request';

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
  }

  async validate(payload: authPayload) {
    const options = (id: string) => ({
      method: 'GET',
      url: `https://dev-llkte41m.us.auth0.com/api/v2/users/${id}`,
      headers: {
        authorization: `Bearer ${this.configService.get<string>(
          'AUTH0_MANAGEMENT_API_TOKEN',
        )}`,
      },
    });

    const { sub } = payload;

    const user = await this.userService.getUserByAuthId(sub);
    if (user) return user;
    else if (!user) {
      let newUser = undefined;
      request(options(sub), async (err, res, body) => {
        if (err) return new BadRequestException();
        const {
          email,
          family_name: firstName,
          given_name: lastName,
          picture,
          pictureUrl,
        } = JSON.parse(body);
        newUser = await this.userService.createUser({
          authId: sub,
          email,
          pictureUrl: pictureUrl || picture || undefined,
          firstName,
          lastName,
        });
      });
      return await newUser.save();
    } else return new BadRequestException('sth went wrong');
  }
}
