import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import {
  QuestionResponseSchema,
  QuestionResponse,
} from './questionResponse.entity';

@Schema({ autoIndex: true })
export class UserSurveyResponse {
  @Prop({ required: true })
  surveyId: string;

  @Prop({ type: [QuestionResponseSchema], default: [], required: true })
  responses: QuestionResponse[];
}
export const UserSurveyResponseSchema =
  SchemaFactory.createForClass(UserSurveyResponse);
