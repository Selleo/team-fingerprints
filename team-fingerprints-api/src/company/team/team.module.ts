import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from '../entities/Company.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
    TeamModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
