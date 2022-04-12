import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ autoIndex: false, timestamps: false })
export class FilterValue extends Document {
  _id?: string | Types.ObjectId;

  @Prop({ required: false, unique: true })
  value: string;
}

export const FilterValueSchema = SchemaFactory.createForClass(FilterValue);
