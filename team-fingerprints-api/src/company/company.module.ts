import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { UsersModule } from 'src/users/users.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyModel, CompanySchema } from './models/company.model';
import { CompanyMembersService } from './company-members.service';
import { TeamModule } from './team/team.module';
import { MailModule } from 'src/mail/mail.module';
import { TfConfigModule } from 'src/tf-config/tf-config.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RoleModule),
    forwardRef(() => TeamModule),
    forwardRef(() => MailModule),
    TfConfigModule,
    MongooseModule.forFeature([
      {
        name: CompanyModel.name,
        schema: CompanySchema,
      },
    ]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyMembersService],
  exports: [CompanyService, CompanyMembersService],
})
export class CompanyModule {}
