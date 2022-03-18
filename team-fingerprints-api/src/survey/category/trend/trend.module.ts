import { forwardRef, Module } from '@nestjs/common';
import { TrendController } from './trend.controller';
import { TrendService } from './trend.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from 'src/survey/models/survey.model';
import { QuestionModule } from './question/question.module';
import { RoleModule } from 'src/role/role.module';
import { SurveyModule } from 'src/survey/survey.module';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    forwardRef(() => SurveyModule),
    MongooseModule.forFeature([
      {
        name: Survey.name,
        schema: SurveySchema,
      },
    ]),
    QuestionModule,
  ],
  controllers: [TrendController],
  providers: [TrendService],
  exports: [TrendService],
})
export class TrendModule {}
