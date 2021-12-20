import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Trend, TrendSchema } from './trend.entity';

@Schema()
export class Category {
  @Prop()
  content: string;

  @Prop({ type: [TrendSchema], default: [] })
  trends: Trend[];
}
export const CategorySchema = SchemaFactory.createForClass(Category);
