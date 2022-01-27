import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.type';
import { UsersService } from 'src/users/users.service';
import { CompanyMembersService } from './company-members.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { Company } from './entities/Company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly usersService: UsersService,
    private readonly roleService: RoleService,
    private readonly companyMembersService: CompanyMembersService,
  ) {}
  async getCompaneis(): Promise<Company[]> {
    return await this.companyModel.find({}).exec();
  }

  async getCompany(adminId: string, companyId: string): Promise<Company> {
    return await this.companyModel.findOne({ _id: companyId, adminId }).exec();
  }

  async getCompanyByUserEmail(email: string): Promise<Company> {
    return await this.companyModel.findOne({ emailWhitelist: email }).exec();
  }

  async createCompany(
    userId: string,
    { name, description, domain }: CreateCompanyDto,
  ): Promise<Company | HttpException> {
    if (await this.isDomainTaken(domain)) {
      return new ForbiddenException(`Domain ${domain} is already taken.`);
    }
    const { email } = await this.usersService.getUser(userId);
    if (!email) return new NotFoundException();

    if (await this.companyMembersService.isUserInAnyCompanyWhitelist(email)) {
      return new ForbiddenException(`You already belong to ${domain} company.`);
    }

    const newCompany = await this.companyModel.create({
      name,
      description,
      domain,
      adminId: userId,
      members: [userId],
      emailWhitelist: [email],
    });
    await this.usersService.updateUser(userId, {
      companyId: newCompany?._id,
    });

    await this.roleService.changeUserRole(userId, Role.COMPANY_ADMIN);

    return newCompany;
  }

  async updateCompany(
    companyId: string,
    companyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return await this.companyModel
      .findOneAndUpdate({ _id: companyId }, companyDto, { new: true })
      .exec();
  }

  async removeCompany(companyId: string): Promise<Company> {
    return await this.companyModel
      .findOneAndDelete({ _id: companyId }, { new: true })
      .exec();
  }

  async isDomainTaken(domain: string): Promise<boolean> {
    const companyByDomain = await this.companyModel.findOne({ domain }).exec();
    return companyByDomain ? true : false;
  }
}
