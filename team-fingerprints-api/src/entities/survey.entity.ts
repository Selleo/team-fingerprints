import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category, CategorySchema } from './category.entity';

@Schema()
export class Survey extends Document {
  @Prop({ type: [CategorySchema], default: [] })
  categories: Category[];

  @Prop()
  public: boolean;

  @Prop()
  draft: boolean;
}
export const SurveySchema = SchemaFactory.createForClass(Survey);
