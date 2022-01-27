import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import * as request from 'request';
import { User } from 'src/users/entities/user.entity';
import { CompanyService } from 'src/company/company.service';
import { TeamMembersService } from 'src/company/team/team-members.service';
import { CompanyMembersService } from 'src/company/company-members.service';

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
    private readonly teamMembersService: TeamMembersService,
    private readonly companyMembersService: CompanyMembersService,
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

  async validate(payload: authPayload): Promise<User | HttpException> {
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
    let user: User = await this.userService.getUserByAuthId(sub);
    if (user) {
      await this.companyMembersService.addMemberToCompanyByEmail(user.email);
      await this.teamMembersService.addMemberToTeamByEmail(user.email);
      return user;
    } else {
      await request(options(sub), async (err, res, body) => {
        if (err) {
          return new BadRequestException();
        }
        const {
          email,
          family_name: firstName,
          given_name: lastName,
          picture,
          pictureUrl,
        } = JSON.parse(body);
        user = await this.userService.createUser({
          authId: sub,
          email,
          pictureUrl: pictureUrl || picture || undefined,
          firstName,
          lastName,
        });
      });
      if (!user) return new BadRequestException();
    }
    await this.companyMembersService.addMemberToCompanyByEmail(user.email);
    await this.teamMembersService.addMemberToTeamByEmail(user.email);
    return user;
  }
}
