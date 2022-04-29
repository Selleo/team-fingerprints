import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { TrendI } from 'team-fingerprints-common';
import { Question, QuestionSchema } from './question.model';

@Schema()
export class Trend implements TrendI {
  _id?: string | Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  primary: string;

  @ApiProperty()
  @Prop({ required: true })
  secondary: string;

  @ApiPropertyOptional()
  @Prop({ type: [QuestionSchema], default: [], required: true })
  questions?: Question[];
}
export const TrendSchema = SchemaFactory.createForClass(Trend);
