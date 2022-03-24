import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { RoleModule } from 'src/role/role.module';
import { UsersModule } from 'src/users/users.module';
import { CompanyModule } from '../company.module';
import { Company, CompanySchema } from '../models/company.model';
import { TeamMembersService } from './team-members.service';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Global()
@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TeamModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => RoleModule),
    forwardRef(() => CompanyModule),
    MailModule,
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamMembersService],
  exports: [TeamService, TeamMembersService],
})
export class TeamModule {}
