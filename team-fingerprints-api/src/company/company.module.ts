import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { UsersModule } from 'src/users/users.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company, CompanySchema } from './entities/Company.entity';
import { CompanyMembersService } from './company-members.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RoleModule),
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
