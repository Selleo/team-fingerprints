import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { SurveyCompleteStatus } from 'src/survey-answer/survey-answer.type';
import { UserSurveyAnswerI } from '../interfaces/user.interface';
import { QuestionAnswerSchema, QuestionAnswer } from './question-answer.model';

@Schema({ _id: false })
export class UserSurveyAnswer implements UserSurveyAnswerI {
  @Prop({ required: true })
  surveyId: string;

  @Prop({ required: true, default: SurveyCompleteStatus.PENDING })
  completeStatus: SurveyCompleteStatus;

  @Prop({ default: 0, required: true })
  amountOfAnswers: number;

  @Prop()
  surveyResult: [any];

  @Prop({ type: [QuestionAnswerSchema], default: [], required: true })
  answers: QuestionAnswer[];
}
export const UserSurveyAnswerSchema =
  SchemaFactory.createForClass(UserSurveyAnswer);
