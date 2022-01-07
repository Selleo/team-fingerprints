import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { QuestionAnswerSchema, QuestionAnswer } from './questionAnswer.entity';

@Schema({ _id: false })
export class UserSurveyAnswer {
  @Prop({ required: true })
  surveyId: string;

  @Prop({ default: 0, required: true })
  amountOfAnswers: number;

  @Prop({ type: [QuestionAnswerSchema], default: [], required: true })
  answers: QuestionAnswer[];
}
export const UserSurveyAnswerSchema =
  SchemaFactory.createForClass(UserSurveyAnswer);
