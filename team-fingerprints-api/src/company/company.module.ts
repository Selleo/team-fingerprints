import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { UsersModule } from 'src/users/users.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company, CompanySchema } from './models/company.model';
import { CompanyMembersService } from './company-members.service';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RoleModule),
    forwardRef(() => TeamModule),
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyMembersService],
  exports: [CompanyService, CompanyMembersService],
})
export class CompanyModule {}
