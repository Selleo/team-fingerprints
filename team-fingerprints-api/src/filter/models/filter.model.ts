import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FilterValueSchema, FilterValue } from './filter-value.model';

@Schema({ autoIndex: false, timestamps: true })
export class Filter extends Document {
  _id?: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  filterPath: string;

  @Prop({ type: [FilterValueSchema], default: [] })
  values: FilterValue[];
}

export const FilterSchema = SchemaFactory.createForClass(Filter);
