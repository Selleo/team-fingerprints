import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { SurveyModel, SurveySchema } from '../models/survey.model';
import { SurveyModule } from '../survey.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TrendModule } from './trend/trend.module';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    MongooseModule.forFeature([
      {
        name: SurveyModel.name,
        schema: SurveySchema,
      },
    ]),
    SurveyModule,
    TrendModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
