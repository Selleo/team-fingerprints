import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  primary: boolean;
}
export const QuestionSchema = SchemaFactory.createForClass(Question);
