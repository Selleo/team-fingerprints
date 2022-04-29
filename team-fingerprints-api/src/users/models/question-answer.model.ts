import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { QuestionAnswer } from 'team-fingerprints-common';

@Schema({ _id: false })
export class QuestionAnswerModel implements QuestionAnswer {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  value: number;
}
export const QuestionAnswerSchema =
  SchemaFactory.createForClass(QuestionAnswerModel);
