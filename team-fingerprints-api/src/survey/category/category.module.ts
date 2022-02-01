import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from '../models/survey.model';
import { SurveyModule } from '../survey.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TrendModule } from './trend/trend.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Survey.name,
        schema: SurveySchema,
      },
    ]),
    SurveyModule,
    TrendModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
