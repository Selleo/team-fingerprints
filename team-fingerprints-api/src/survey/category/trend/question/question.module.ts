import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { SurveyModel, SurveySchema } from 'src/survey/models/survey.model';
import { SurveyModule } from 'src/survey/survey.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    forwardRef(() => SurveyModule),
    MongooseModule.forFeature([
      {
        name: SurveyModel.name,
        schema: SurveySchema,
      },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
