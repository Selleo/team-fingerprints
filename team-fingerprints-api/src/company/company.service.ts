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
import { RoleType } from 'team-fingerprints-common';
import { TfConfigService } from 'src/tf-config/tf-config.service';
import { UsersService } from 'src/users/users.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { Company } from './models/company.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const isDomainValid = require('is-valid-domain');

interface DomainBlacklist {
  domains: string[];
}

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly roleService: RoleService,
    private readonly tfConfigService: TfConfigService,
  ) {}

  async getCompanyById(companyId: string): Promise<Company> {
    return await this.companyModel.findOne({ _id: companyId }).exec();
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

  async getCompaneis(): Promise<Company[]> {
    const companies = await this.companyModel.find().exec();
    if (companies && companies.length > 0) return companies;
    else return [];
  }

  async createCompany(
    userId: string,
    {
      name,
      description = '',
      domain = '',
      pointColor,
      pointShape,
    }: CreateCompanyDto,
  ): Promise<Company | HttpException> {
    if (domain.length > 0) {
      if (!isDomainValid(domain))
        throw new BadRequestException('Invalid domain');

      const data: DomainBlacklist =
        await this.tfConfigService.getEmailBlackList();

      if (data?.domains?.includes(domain))
        throw new BadRequestException(
          'Can not add this domain to your company',
        );

      if (await this.isDomainTaken(domain)) {
        throw new ForbiddenException(`Domain ${domain} is already taken.`);
      }
    }

    const newCompany = await this.companyModel.create({
      name,
      description,
      domain: domain.length > 0 ? domain.toLowerCase() : '',
      pointColor,
      pointShape,
    });

    await newCompany.save();

    const user = await this.usersService.getUserById(userId);
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
    {
      name,
      description = '',
      domain: newDomain = '',
      pointColor,
      pointShape,
    }: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.companyModel.findById(companyId);

    const { domains }: DomainBlacklist =
      await this.tfConfigService.getEmailBlackList();

    if (newDomain && newDomain?.length > 0 && company?.domain !== newDomain) {
      if (!isDomainValid(newDomain))
        throw new BadRequestException('Invalid domain');

      if (domains?.includes(newDomain))
        throw new BadRequestException(
          'Can not add this domain to your company',
        );

      if (await this.isDomainTaken(newDomain))
        throw new ForbiddenException(`Domain ${newDomain} is already taken.`);
    }

    if (company.domain?.length > 0 && company.domain === newDomain)
      return company;

    return await this.companyModel
      .findOneAndUpdate(
        { _id: companyId },
        {
          name,
          description,
          domain: newDomain?.length > 0 ? newDomain.toLowerCase() : '',
          pointColor,
          pointShape,
        },
        { new: true },
      )
      .exec();
  }

  async isDomainTaken(domain: string): Promise<boolean> {
    const companyByDomain = await this.companyModel
      .findOne({ domain: domain.toLowerCase() })
      .exec();
    return companyByDomain ? true : false;
  }

  async deleteCompany(companyId: string): Promise<Company> {
    return await this.companyModel.findByIdAndDelete(companyId);
  }

  async deleteCompanyWithoutMembers(companyId: string): Promise<void> {
    const roleDocuments = await this.roleService.findAllRoleDocuments({
      companyId,
    });
    if (!roleDocuments || roleDocuments.length <= 0) {
      this.deleteCompany(companyId);
    }
  }
}
