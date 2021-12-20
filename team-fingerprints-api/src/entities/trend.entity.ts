import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './question.entity';

@Schema()
export class Trend {
  @Prop({ required: true })
  primary: string;

  @Prop({ required: true })
  secondary: string;

  @Prop({ type: [QuestionSchema], default: [], required: true })
  questions?: Question[];
}
export const TrendSchema = SchemaFactory.createForClass(Trend);
