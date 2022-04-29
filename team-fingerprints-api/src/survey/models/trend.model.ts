import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Trend } from 'team-fingerprints-common';
import { QuestionModel, QuestionSchema } from './question.model';

@Schema()
export class TrendModel implements Trend {
  _id?: string | Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  primary: string;

  @ApiProperty()
  @Prop({ required: true })
  secondary: string;

  @ApiPropertyOptional()
  @Prop({ type: [QuestionSchema], default: [], required: true })
  questions?: QuestionModel[];
}
export const TrendSchema = SchemaFactory.createForClass(TrendModel);
