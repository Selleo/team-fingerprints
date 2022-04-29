import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { QuestionAnswerI } from 'team-fingerprints-common';

@Schema({ _id: false })
export class QuestionAnswer implements QuestionAnswerI {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  value: number;
}
export const QuestionAnswerSchema =
  SchemaFactory.createForClass(QuestionAnswer);
