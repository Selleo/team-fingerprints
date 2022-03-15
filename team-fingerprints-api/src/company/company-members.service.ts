import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/role/models/role.model';
import { RoleService } from 'src/role/role.service';
import { RoleType } from 'src/role/role.type';
import { UsersService } from 'src/users/users.service';
import { CompanyService } from './company.service';
import { Company } from './models/company.model';
import { TeamMembersService } from './team/team-members.service';
import { TeamService } from './team/team.service';

@Injectable()
export class CompanyMembersService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly usersService: UsersService,
    private readonly companyService: CompanyService,
    @Inject(forwardRef(() => TeamMembersService))
    private readonly teamMembersService: TeamMembersService,
    private readonly teamService: TeamService,
    private readonly roleService: RoleService,
  ) {}

  async isUserInCompanyDomain(email: string): Promise<Company> {
    return await this.companyModel.findOne({
      domain: email.split('@')[1],
    });
  }

  async addUserToCompanyWhitelist(
    email: string,
    companyId: string,
  ): Promise<Role | HttpException> {
    const roleDocument = await this.roleService.findOneRoleDocument({
      email,
      companyId,
      role: RoleType.USER,
    });
    if (roleDocument) return;

    return await this.roleService.createRoleDocument(
      { email },
      { email, companyId, role: RoleType.USER },
    );
  }

  async addMemberToCompanyByEmail(
    email: string,
    companyId: string,
  ): Promise<Role | HttpException> {
    const roleDocument = await this.roleService.findOneRoleDocument({
      email,
      companyId,
    });

    if (!roleDocument) throw new NotFoundException();

    const user = await this.usersService.getUserByEmail(email);

    return await this.roleService.updateRoleDocument(roleDocument, {
      userId: user._id,
    });
  }

  async removeCompanyMemberByEmail(email: string, companyId: string) {
    const roleDocuments = await this.roleService.findAllRoleDocuments({
      email,
      companyId,
    });

    if (!roleDocuments || roleDocuments.length <= 0)
      throw new NotFoundException();

    return await this.usersService.getUserByEmail(email);
  }
}
