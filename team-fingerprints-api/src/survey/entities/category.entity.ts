import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Trend, TrendSchema } from './trend.entity';

@Schema()
export class Category {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [TrendSchema], default: [], required: true })
  trends?: Trend[];
}
export const CategorySchema = SchemaFactory.createForClass(Category);
