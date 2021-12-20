import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category, CategorySchema } from './category.entity';

@Schema({ autoIndex: true, timestamps: true })
export class Survey extends Document {
  @Prop({ type: [CategorySchema], default: [], required: true })
  categories?: Category[];

  @Prop({ default: false, required: true })
  public: boolean;

  @Prop({ default: true, required: true })
  draft: boolean;
}
export const SurveySchema = SchemaFactory.createForClass(Survey);
