import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './models/user.model';
import { CompanyModule } from 'src/company/company.module';
import { TeamModule } from 'src/company/team/team.module';
import { RoleModule } from 'src/role/role.module';
import { FilterModule } from 'src/filter/filter.module';
import { SurveyResultModule } from 'src/survey-result/survey-result.module';
import { SurveyFiltersModule } from 'src/survey-filters/survey-filters.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => CompanyModule),
    forwardRef(() => TeamModule),
    forwardRef(() => RoleModule),
    forwardRef(() => FilterModule),
    forwardRef(() => SurveyResultModule),
    forwardRef(() => SurveyFiltersModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
