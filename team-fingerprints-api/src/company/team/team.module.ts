import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { Company, CompanySchema } from '../entities/Company.entity';
import { TeamMembersService } from './team-members.service';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TeamModule),
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
