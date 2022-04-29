import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Category } from 'team-fingerprints-common';
import { TrendModel, TrendSchema } from './trend.model';

@Schema()
export class CategoryModel implements Category {
  _id?: string | Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiPropertyOptional()
  @Prop({ type: [TrendSchema], default: [], required: true })
  trends?: TrendModel[];
}
export const CategorySchema = SchemaFactory.createForClass(CategoryModel);
