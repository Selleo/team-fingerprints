import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleType } from 'src/role/role.type';
import { CompanyService } from './company.service';
import {
  ValidateEmail,
  CreateCompanyDto,
  UpdateCompanyDto,
} from './dto/company.dto';
import { Company } from './models/company.model';
import { CompanyMembersService } from './company-members.service';

@ApiTags('companies')
@Controller({ version: '1' })
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyMembersService: CompanyMembersService,
  ) {}

  @Get()
  @UseGuards(RoleGuard([RoleType.USER, RoleType.COMPANY_ADMIN]))
  async getCompanies(): Promise<Company[]> {
    return await this.companyService.getCompaneis();
  }

  @Get(':companyId')
  @UseGuards(RoleGuard([RoleType.COMPANY_ADMIN]))
  async getCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<Company> {
    return await this.companyService.getCompanyByAdminId(userId, companyId);
  }

  @Post()
  @UseGuards(RoleGuard([RoleType.USER], false))
  async createCompany(
    @Body() companyDto: CreateCompanyDto,
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<Company | HttpException> {
    return await this.companyService.createCompany(userId, companyDto);
  }

  @Patch(':companyId')
  @UseGuards(RoleGuard([RoleType.COMPANY_ADMIN], false))
  async updateCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() companyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return await this.companyService.updateCompany(companyId, companyDto);
  }

  @Post(':companyId/member')
  @UseGuards(RoleGuard([RoleType.COMPANY_ADMIN], false))
  async addUserToCompanyWhitelist(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() { email }: ValidateEmail,
  ): Promise<Company | HttpException> {
    return await this.companyMembersService.addUserToCompanyWhitelist(
      companyId,
      email,
    );
  }

  @UseGuards(RoleGuard([RoleType.COMPANY_ADMIN], false))
  @Delete(':companyId/member')
  async removeCompanyMemberByEmail(@Body() { email }: ValidateEmail) {
    return await this.companyMembersService.removeCompanyMemberByEmail(email);
  }
}
