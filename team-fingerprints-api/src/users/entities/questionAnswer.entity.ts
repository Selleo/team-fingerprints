import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class QuestionAnswer {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  value: number;
}
export const QuestionAnswerSchema =
  SchemaFactory.createForClass(QuestionAnswer);
