import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FilterValueSchema, FilterValueModel } from './filter-value.model';

@Schema({ collection: 'filters', autoIndex: true, timestamps: true })
export class FilterModel extends Document {
  _id?: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  filterPath: string;

  @Prop({ type: [FilterValueSchema], default: [] })
  values: FilterValueModel[];
}

export const FilterSchema = SchemaFactory.createForClass(FilterModel);
