import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from 'src/users/user.type';
import { UsersService } from 'src/users/users.service';
import { CreateCompanyDto } from './dto/CreateCompanyDto.dto';
import { UpdateCompanyDto } from './dto/UpdateCompanyDto.dto';
import { Company } from './entities/Company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly usersService: UsersService,
  ) {}
  async getCompaneis() {
    return await this.companyModel.find({}).exec();
  }

  async getCompany(adminId: string, companyId: string) {
    return await this.companyModel.findOne({ _id: companyId, adminId }).exec();
  }

  async createCompany(userId: string, { name, description }: CreateCompanyDto) {
    await this.usersService.changeUserRole(userId, UserRole.COMPANY_ADMIN);
    const newCompany = await this.companyModel.create({
      name,
      description,
      adminId: userId,
    });
    await this.usersService.updateUser(userId, {
      companyId: newCompany?._id,
    });

    return newCompany;
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
