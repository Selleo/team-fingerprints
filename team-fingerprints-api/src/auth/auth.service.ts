import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import * as request from 'request';
import { User } from 'src/users/models/user.model';
import { RoleService } from 'src/role/role.service';
import { CompanyMembersService } from 'src/company/company-members.service';
import axios from 'axios';
import * as qs from 'qs';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
    private readonly companyMembersService: CompanyMembersService,
    private readonly mailService: MailService,
  ) {}

  async handleExistingUsers(email: string) {
    const roleDocuments = await this.roleService.findAllRoleDocuments({
      email,
    });

    const user = await this.usersService.getUserByEmail(email);

    await this.companyMembersService.handleUserInCompanyDomain(email);

    roleDocuments.forEach(async (doc) => {
      if (!doc.userId || doc.userId.length <= 0) {
        await this.roleService.updateRoleDocument(
          { _id: doc._id },
          { userId: user._id.toString() },
        );
      }
    });
  }

  async handleNewUsers(auth0Id: string) {
    const token = await this.getAuth0ManagementApiToken();
    const AUTH0_API_EXPLORER_CLIENT_AUDIENCE = this.configService.get<string>(
      'AUTH0_API_EXPLORER_CLIENT_AUDIENCE',
    );

    const options = (id: string) => {
      return {
        method: 'GET',
        url: `${AUTH0_API_EXPLORER_CLIENT_AUDIENCE}users/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
    };

    let user: User;
    await request(options(auth0Id), async (err, res, body) => {
      if (err) {
        throw new BadRequestException(
          'Can not register user in teamfingerprints.selleo.com',
        );
      }
      const {
        email,
        family_name: firstName,
        given_name: lastName,
        picture,
        pictureUrl,
      } = JSON.parse(body);

      user = await this.usersService.getUserByEmail(email);
      if (user) return await this.handleExistingUsers(email);

      user = await this.usersService.createUser({
        authId: auth0Id,
        email,
        pictureUrl: pictureUrl || picture || undefined,
        firstName,
        lastName,
      });
      if (!user) throw new BadRequestException();

      this.mailService.newAccountMail(user.email);
      await this.handleExistingUsers(user.email);
    });
    return user;
  }

  async getAuth0ManagementApiToken() {
    const AUTH0_API_EXPLORER_CLIENT_ID = this.configService.get<string>(
      'AUTH0_API_EXPLORER_CLIENT_ID',
    );
    const AUTH0_API_EXPLORER_CLIENT_SECRET = this.configService.get<string>(
      'AUTH0_API_EXPLORER_CLIENT_SECRET',
    );
    const AUTH0_API_EXPLORER_CLIENT_AUDIENCE = this.configService.get<string>(
      'AUTH0_API_EXPLORER_CLIENT_AUDIENCE',
    );

    const options = {
      method: 'POST',
      url: 'https://dev-llkte41m.us.auth0.com/oauth/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        grant_type: 'client_credentials',
        client_id: AUTH0_API_EXPLORER_CLIENT_ID,
        client_secret: AUTH0_API_EXPLORER_CLIENT_SECRET,
        audience: AUTH0_API_EXPLORER_CLIENT_AUDIENCE,
      }),
    };

    const response = await axios.request(options as any);
    if (response.status !== 200) throw new UnauthorizedException();

    return response.data.access_token;
  }
}
