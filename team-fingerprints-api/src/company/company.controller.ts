import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { Role } from 'src/role/role.type';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { Company } from './entities/Company.entity';

@ApiTags('companies')
@Controller({ version: '1' })
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(RoleGuard())
  async getCompanies(): Promise<Company[]> {
    return await this.companyService.getCompaneis();
  }

  @Get('/:companyId')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async getCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<Company> {
    return await this.companyService.getCompany(userId, companyId);
  }

  @Post()
  @UseGuards(RoleGuard([Role.USER]))
  async createCompany(
    @Body() companyDto: CreateCompanyDto,
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<Company> {
    return await this.companyService.createCompany(userId, companyDto);
  }

  @Patch('/:companyId')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async updateCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() companyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return await this.companyService.updateCompany(companyId, companyDto);
  }

  @Delete('/:companyId')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async removeCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
  ): Promise<Company> {
    return await this.companyService.removeCompany(companyId);
  }
}
