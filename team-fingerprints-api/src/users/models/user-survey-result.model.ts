import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { UserSurveyResultI } from '../interfaces/user.interface';
import { QuestionAnswerSchema, QuestionAnswer } from './question-answer.model';

@Schema({ _id: false })
export class UserSurveyResult implements UserSurveyResultI {
  @Prop({ required: true })
  category: string;

  @Prop({ type: [QuestionAnswerSchema], default: [], required: true })
  answers: QuestionAnswer[];
}
export const UserSurveyResultSchema =
  SchemaFactory.createForClass(UserSurveyResult);
