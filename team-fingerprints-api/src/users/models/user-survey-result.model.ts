import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { UserSurveyResult } from 'team-fingerprints-common';
import {
  QuestionAnswerSchema,
  QuestionAnswerModel,
} from './question-answer.model';

@Schema({ _id: false })
export class UserSurveyResultModel implements UserSurveyResult {
  @Prop({ required: true })
  category: string;

  @Prop({ type: [QuestionAnswerSchema], default: [], required: true })
  answers: QuestionAnswerModel[];
}
export const UserSurveyResultSchema = SchemaFactory.createForClass(
  UserSurveyResultModel,
);
