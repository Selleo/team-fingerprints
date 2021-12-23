import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ autoIndex: true })
export class QuestionResponse {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  primary: boolean;

  @Prop({ required: true })
  valueForPrimary: number;
}
export const QuestionResponseSchema =
  SchemaFactory.createForClass(QuestionResponse);
