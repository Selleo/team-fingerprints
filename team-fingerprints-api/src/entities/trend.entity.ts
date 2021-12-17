import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './question.entity';

@Schema()
export class Trend {
  @Prop()
  primary: string;

  @Prop()
  secondary: string;

  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[];
}
export const TrendSchema = SchemaFactory.createForClass(Trend);
