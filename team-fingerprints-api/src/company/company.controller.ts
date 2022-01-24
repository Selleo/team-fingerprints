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
import { RoleGuard } from 'src/common/decorators/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { UserRole } from 'src/users/user.type';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/CreateCompanyDto.dto';
import { UpdateCompanyDto } from './dto/UpdateCompanyDto.dto';

@ApiTags('companies')
@Controller({ version: '1' })
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(RoleGuard())
  async getCompanies() {
    return await this.companyService.getCompaneis();
  }

  @Get('/:companyId')
  async getCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @CurrentUserId(ValidateObjectId) userId: string,
  ) {
    return await this.companyService.getCompany(userId, companyId);
  }

  @Post()
  @UseGuards(RoleGuard([UserRole.USER]))
  async createCompany(
    @Body() companyDto: CreateCompanyDto,
    @CurrentUserId(ValidateObjectId) userId: string,
  ) {
    return await this.companyService.createCompany(
      '61e971c6742c91d5a3907b40',
      companyDto,
    );
  }

  @Patch('/:companyId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async updateCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() body: UpdateCompanyDto,
  ) {
    return await this.companyService.updateCompany(companyId, body);
  }

  @Delete('/:companyId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async removeCompany(@Param('companyId', ValidateObjectId) companyId: string) {
    return await this.companyService.removeCompany(companyId);
  }
}
