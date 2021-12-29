import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class QuestionResponse {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  primary: boolean;
}
export const QuestionResponseSchema =
  SchemaFactory.createForClass(QuestionResponse);
