import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ autoIndex: true, timestamps: false })
export class FilterValueModel extends Document {
  _id?: string | Types.ObjectId;

  @Prop({ required: false, unique: true })
  value: string;
}

export const FilterValueSchema = SchemaFactory.createForClass(FilterValueModel);
