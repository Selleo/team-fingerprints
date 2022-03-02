import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.type';
import { UsersService } from 'src/users/users.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { Company } from './models/company.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const isDomainValid = require('is-valid-domain');

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly roleService: RoleService,
  ) {}
  async getCompaneis(): Promise<Company[]> {
    const companies = await this.companyModel.find({}).exec();
    if (companies && companies.length > 0) return companies;
    else return [];
  }

  async getCompanyByAdminId(
    adminId: string,
    companyId: string,
  ): Promise<Company> {
    return await this.companyModel.findOne({ _id: companyId, adminId }).exec();
  }

  async getCompanyById(companyId: string): Promise<Company> {
    return await this.companyModel.findOne({ _id: companyId }).exec();
  }

  async getCompanyByUserEmail(email: string): Promise<Company> {
    return await this.companyModel.findOne({ emailWhitelist: email }).exec();
  }

  async createCompany(
    userId: string,
    { name, description, domain }: CreateCompanyDto,
  ): Promise<Company | HttpException> {
    if (!isDomainValid(domain)) throw new BadRequestException('Invalid domain');

    if (await this.isDomainTaken(domain)) {
      throw new ForbiddenException(`Domain ${domain} is already taken.`);
    }
    const { email } = await this.usersService.getUser(userId);
    if (!email) throw new NotFoundException();

    if (await this.getCompanyByUserEmail(email)) {
      throw new ForbiddenException(`You already belong to ${domain} company.`);
    }

    const newCompany = await this.companyModel.create({
      name,
      description,
      domain: domain.toLowerCase(),
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

  async isDomainTaken(domain: string): Promise<boolean> {
    const companyByDomain = await this.companyModel
      .findOne({ domain: domain.toLowerCase() })
      .exec();
    return companyByDomain ? true : false;
  }
}
