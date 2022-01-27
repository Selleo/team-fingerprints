import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleService } from 'src/role/role.service';
import { UsersService } from 'src/users/users.service';
import { Company } from './entities/Company.entity';

@Injectable()
export class CompanyMembersService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly usersService: UsersService,
    private readonly roleService: RoleService,
  ) {}

  async isUserInAnyCompanyWhitelist(email: string): Promise<Company> {
    const company = await this.companyModel.findOne({ emailWhitelist: email });
    return company;
  }

  async isUserInCompanyDomain(email: string): Promise<Company> {
    const company = await this.companyModel.findOne({
      domain: email.split('@')[1],
    });
    return company;
  }

  async addUserToCompanyWhitelist(
    company: string,
    email: string,
    currentUser: string,
  ): Promise<Company | HttpException> {
    if (await this.isUserInAnyCompanyWhitelist(email)) {
      return new ForbiddenException();
    }

    const { companyId } = await this.usersService.getUser(currentUser);
    if (companyId && companyId !== company) return new UnauthorizedException();

    return await this.companyModel.findOneAndUpdate(
      { _id: companyId },
      { $push: { emailWhitelist: email } },
      { new: true },
    );
  }

  async addMemberToCompanyByEmail(
    email: string,
  ): Promise<Company | HttpException> {
    const destinationCompnay =
      (await this.isUserInAnyCompanyWhitelist(email)) ||
      (await this.isUserInCompanyDomain(email));

    if (!destinationCompnay) {
      return new NotFoundException();
    }

    const newMember = await this.usersService.getUserByEmail(email);
    if (!newMember) return new NotFoundException();

    const newMemberId = newMember?._id.toString();

    const members = destinationCompnay.members || [];

    if (members.find((el) => el === newMemberId)) {
      return new ForbiddenException();
    }

    const companyWithNewMember = await this.companyModel
      .findOneAndUpdate(
        { _id: destinationCompnay._id },
        { $push: { members: newMemberId } },
        { new: true },
      )
      .exec();
    if (!companyWithNewMember) return new InternalServerErrorException();
    return companyWithNewMember;
  }
}
