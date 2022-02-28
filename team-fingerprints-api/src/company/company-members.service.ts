import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/role/role.type';
import { UsersService } from 'src/users/users.service';
import { CompanyService } from './company.service';
import { Company } from './models/company.model';
import { Team } from './models/team.model';
import { TeamMembersService } from './team/team-members.service';
import { TeamService } from './team/team.service';

@Injectable()
export class CompanyMembersService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly usersService: UsersService,
    private readonly companyService: CompanyService,
    private readonly teamMembersService: TeamMembersService,
    private readonly teamService: TeamService,
  ) {}

  async isUserInAnyCompanyWhitelist(email: string): Promise<Company> {
    return await this.companyModel.findOne({ emailWhitelist: email });
  }

  async isUserInCompanyDomain(email: string): Promise<Company> {
    return await this.companyModel.findOne({
      domain: email.split('@')[1],
    });
  }

  async addUserToCompanyWhitelist(
    companyId: string,
    email: string,
  ): Promise<Company | HttpException> {
    if (await this.teamMembersService.isSuperAdminByEmail(email))
      throw new BadRequestException('This user can not be managed');

    const user = await this.usersService.getUserByEmail(email);
    if (user && user.role !== Role.USER) return;

    if (!(await this.isUserInAnyCompanyWhitelist(email))) {
      return await this.companyModel.findOneAndUpdate(
        { _id: companyId },
        { $push: { emailWhitelist: email } },
        { new: true },
      );
    }
    return await this.companyService.getCompanyByUserEmail(user.email);
  }

  async addMemberToCompanyByEmail(
    email: string,
  ): Promise<Company | HttpException> {
    if (await this.teamMembersService.isSuperAdminByEmail(email))
      throw new BadRequestException('This user can not be managed');

    const user = await this.usersService.getUserByEmail(email);
    if (user.role !== Role.USER) return;

    const destinationCompnay =
      (await this.isUserInAnyCompanyWhitelist(email)) ||
      (await this.isUserInCompanyDomain(email));

    if (await this.isUserInCompanyDomain(email)) {
      await this.addUserToCompanyWhitelist(destinationCompnay?._id, email);
    }

    if (!destinationCompnay) return;

    const newMember = await this.usersService.getUserByEmail(email);
    if (!newMember) throw new NotFoundException();

    const newMemberId = newMember?._id.toString();
    const members = destinationCompnay.members || [];

    if (members.find((el) => el === newMemberId)) return;

    const companyWithNewMember = await this.companyModel
      .findOneAndUpdate(
        { _id: destinationCompnay._id },
        { $push: { members: newMemberId } },
        { new: true },
      )
      .exec();

    if (!companyWithNewMember) throw new InternalServerErrorException();
    return companyWithNewMember;
  }

  async removeCompanyMemberByEmail(email: string) {
    if (!(await this.isUserInAnyCompanyWhitelist(email)))
      throw new NotFoundException();

    const company = await this.companyService.getCompanyByUserEmail(email);
    const user = await this.usersService.getUserByEmail(email);
    if (!company && !user) throw new NotFoundException();

    const userId = user?._id.toString();
    const team: Team = await this.teamService.getTeamByUserEmail(email);

    if (team) {
      await this.teamMembersService.removeMemberFromTeam(
        company._id,
        team?._id,
        email,
      );
    }

    return await this.companyModel.findOneAndUpdate(
      { _id: company._id },
      {
        $pull: {
          members: userId,
          emailWhitelist: email,
        },
      },
      {
        new: true,
      },
    );
  }
}
