import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleService } from 'src/role/role.service';
import { RoleType } from 'src/role/role.type';
import { TfConfigService } from 'src/tf-config/tf-config.service';
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
    private readonly tfConfigService: TfConfigService,
  ) {}
  async getCompaneis(): Promise<Company[]> {
    const companies = await this.companyModel.find({}).exec();
    if (companies && companies.length > 0) return companies;
    else return [];
  }

  async getCompany(companyId: string) {
    const company = await this.companyModel.findOne({ _id: companyId }).exec();
    if (!company) throw new NotFoundException();

    const roleDocuments = await this.roleService.findAllRoleDocuments({
      companyId,
    });

    if (!roleDocuments || roleDocuments.length <= 0) return { company };

    return { company, roles: roleDocuments };
  }

  async getCompanyById(companyId: string): Promise<Company> {
    return await this.companyModel.findOne({ _id: companyId }).exec();
  }

  async createCompany(
    userId: string,
    { name, description, domain, pointColor, pointShape }: CreateCompanyDto,
  ): Promise<Company | HttpException> {
    if (!isDomainValid(domain)) throw new BadRequestException('Invalid domain');

    interface DomainBlacklist {
      domains: string[];
    }

    const data: DomainBlacklist =
      await this.tfConfigService.getEmailBlackList();

    if (data?.domains.includes(domain))
      throw new BadRequestException('Can not add this domain to your company');

    if (await this.isDomainTaken(domain)) {
      throw new ForbiddenException(`Domain ${domain} is already taken.`);
    }

    const newCompany = await this.companyModel.create({
      name,
      description,
      domain: domain.toLowerCase(),
      pointColor,
      pointShape,
    });

    await newCompany.save();

    const user = await this.usersService.getUser(userId);
    const roleDocument = await this.roleService.createRoleDocument(user, {
      userId: user._id,
      role: RoleType.COMPANY_ADMIN,
      companyId: newCompany._id,
    });

    if (!roleDocument) throw new InternalServerErrorException();

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
