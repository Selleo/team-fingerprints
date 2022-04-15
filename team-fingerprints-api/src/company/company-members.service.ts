import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { RoleService } from 'src/role/role.service';
import { RoleType } from 'src/role/role.type';
import { UsersService } from 'src/users/users.service';
import { CompanyService } from './company.service';
import { Company } from './models/company.model';

@Injectable()
export class CompanyMembersService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly usersService: UsersService,
    private readonly roleService: RoleService,
    private readonly mailService: MailService,
    private readonly companyService: CompanyService,
  ) {}

  async isUserInCompanyDomain(email: string): Promise<Company> {
    return await this.companyModel.findOne({
      domain: email.split('@')[1],
    });
  }

  async handleUserInCompanyDomain(email: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (user.inCompany) return;

    const company = await this.isUserInCompanyDomain(email);
    if (!company) return;

    if (
      await this.roleService.findRoleDocument({
        email,
        companyId: company._id,
      })
    )
      return;

    await this.roleService.createRoleDocument(user, {
      userId: user._id,
      email: user.email,
      companyId: company._id,
      role: RoleType.USER,
    });

    await this.usersService.userInCompany(user._id);
  }

  async addUsersToCompanyWhitelist(emails: string[], companyId: string) {
    if (!emails.every((el) => isEmail(el))) {
      throw new BadRequestException('Invalid email');
    }

    return await Promise.all(
      emails.map(async (email) => {
        const roleDocument = await this.roleService.findRoleDocument({
          email,
          companyId,
          role: RoleType.USER,
        });
        if (roleDocument) return email;

        const newRoleDocument = await this.roleService.createRoleDocument(
          { email },
          { email, companyId, role: RoleType.USER },
        );

        if (!newRoleDocument) throw new InternalServerErrorException();

        const company = await this.companyService.getCompanyById(companyId);

        this.mailService.inviteToCompanyMail(email, company.name);
        return email;
      }),
    );
  }

  async addCompanyAdmin(email: string, companyId: string) {
    if (!isEmail(email)) throw new BadRequestException('Invalid email');

    const roleDocumentExists = await this.roleService.findRoleDocument({
      email,
      companyId,
      role: RoleType.COMPANY_ADMIN,
    });

    if (roleDocumentExists)
      throw new BadRequestException(
        'This user has already company_admin role in this company',
      );

    return await this.roleService.addCompanyAdminRole(email, companyId);
  }
}
