import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class Question {
  @Prop()
  content: string;

  @Prop()
  primary: boolean;
}
export const QuestionSchema = SchemaFactory.createForClass(Question);
