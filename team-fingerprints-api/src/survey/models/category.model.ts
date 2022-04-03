import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryI } from '../interfaces/survey.interface';
import { Trend, TrendSchema } from './trend.model';

@Schema()
export class Category implements CategoryI {
  _id?: string;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiPropertyOptional()
  @Prop({ type: [TrendSchema], default: [], required: true })
  trends?: Trend[];
}
export const CategorySchema = SchemaFactory.createForClass(Category);
