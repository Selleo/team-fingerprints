import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dto/CreateCompanyDto.dto';
import { UpdateCompanyDto } from './dto/UpdateCompanyDto.dto';
import { Company } from './entities/Company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}
  async getCompaneis() {
    return await this.companyModel.find({}).exec();
  }

  async getCompany(companyId: string) {
    return await this.companyModel.findOne({ _id: companyId }).exec();
  }

  async createCompany({ name, description }: CreateCompanyDto) {
    return await this.companyModel.create({
      name,
      description,
      adminId: '61c59becd19b89a4b96a343e',
    });
  }

  async updateCompany(companyId: string, body: UpdateCompanyDto) {
    return await this.companyModel
      .findOneAndUpdate({ _id: companyId }, body)
      .exec();
  }

  async removeCompany(companyId: string) {
    return await this.companyModel.findOneAndDelete({ _id: companyId }).exec();
  }
}
