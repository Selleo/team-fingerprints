import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { Survey, SurveySchema } from 'src/survey/models/survey.model';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    MongooseModule.forFeature([
      {
        name: Survey.name,
        schema: SurveySchema,
      },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
