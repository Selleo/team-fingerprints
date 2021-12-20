import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from 'src/entities/survey.entity';
import { SurveyModule } from '../survey.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Survey.name,
        schema: SurveySchema,
      },
    ]),
    SurveyModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
