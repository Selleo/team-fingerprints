import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleType } from 'team-fingerprints-common';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { Company } from './models/company.model';
import { CompanyMembersService } from './company-members.service';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('companies')
@Controller({ version: '1' })
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyMembersService: CompanyMembersService,
  ) {}

  @Get()
  @Roles([RoleType.SUPER_ADMIN, RoleType.USER, RoleType.COMPANY_ADMIN])
  async getCompanies(): Promise<Company[]> {
    return await this.companyService.getCompaneis();
  }

  @Get('/:companyId')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.USER])
  async getCompany(@Param('companyId', ValidateObjectId) companyId: string) {
    return await this.companyService.getCompany(companyId);
  }

  @Post()
  async createCompany(
    @Body() companyDto: CreateCompanyDto,
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<Company | HttpException> {
    return await this.companyService.createCompany(userId, companyDto);
  }

  @Patch('/:companyId')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN])
  async updateCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() companyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return await this.companyService.updateCompany(companyId, companyDto);
  }

  @Post('/:companyId/member')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN])
  async addUserToCompanyWhitelist(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body('emails') emails: string[],
  ) {
    return await this.companyMembersService.addUsersToCompanyWhitelist(
      emails,
      companyId,
    );
  }

  @Post('/:companyId/companyAdmin')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN])
  async addCompanyAdmin(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body('email') email: string,
  ) {
    return await this.companyMembersService.addCompanyAdmin(email, companyId);
  }
}
