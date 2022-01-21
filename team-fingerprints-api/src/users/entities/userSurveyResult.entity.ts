import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { QuestionAnswerSchema, QuestionAnswer } from './questionAnswer.entity';

@Schema({ _id: false })
export class UserSurveyResult {
  @Prop({ required: true })
  category: string;

  @Prop({ type: [QuestionAnswerSchema], default: [], required: true })
  answers: QuestionAnswer[];
}
export const UserSurveyResultSchema =
  SchemaFactory.createForClass(UserSurveyResult);
