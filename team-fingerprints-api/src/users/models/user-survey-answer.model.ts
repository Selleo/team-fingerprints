import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import {
  SurveyCompleteStatus,
  UserSurveyAnswer,
} from 'team-fingerprints-common';
import {
  QuestionAnswerSchema,
  QuestionAnswerModel,
} from './question-answer.model';

@Schema({ _id: false })
export class UserSurveyAnswerModel implements UserSurveyAnswer {
  @Prop({ required: true })
  surveyId: string;

  @Prop({ required: true, default: SurveyCompleteStatus.PENDING })
  completeStatus: SurveyCompleteStatus;

  @Prop({ default: 0, required: true })
  amountOfAnswers: number;

  @Prop()
  surveyResult: [any];

  @Prop({ type: [QuestionAnswerSchema], default: [], required: true })
  answers: QuestionAnswerModel[];
}
export const UserSurveyAnswerSchema = SchemaFactory.createForClass(
  UserSurveyAnswerModel,
);
