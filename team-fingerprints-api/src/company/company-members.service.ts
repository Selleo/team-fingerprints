import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { Company } from './entities/Company.entity';

@Injectable()
export class CompanyMembersService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly usersService: UsersService,
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
    if (await this.isUserInAnyCompanyWhitelist(email)) {
      return new ForbiddenException();
    }

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

    if (await this.isUserInCompanyDomain(email)) {
      await this.addUserToCompanyWhitelist(destinationCompnay?._id, email);
    }

    if (!destinationCompnay) return new NotFoundException();

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
