import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/CreateCompanyDto.dto';
import { UpdateCompanyDto } from './dto/UpdateCompanyDto.dto';

@ApiTags('company')
@Controller({ path: 'company', version: '1' })
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Get()
  async getCompanies() {
    return await this.companyService.getCompaneis();
  }

  @Get('/:companyId')
  async getCompany(@Param('companyId', ValidateObjectId) companyId: string) {
    return await this.companyService.getCompany(companyId);
  }

  @Post('')
  async createCompany(@Body() body: CreateCompanyDto) {
    return await this.companyService.createCompany(body);
  }

  @Patch('/:companyId')
  async updateCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() body: UpdateCompanyDto,
  ) {
    return await this.companyService.updateCompany(companyId, body);
  }

  @Delete('/:companyId')
  async removeCompany(@Param('companyId', ValidateObjectId) companyId: string) {
    return await this.companyService.removeCompany(companyId);
  }
}
