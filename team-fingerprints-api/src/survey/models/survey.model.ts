import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { SurveyI } from '../interfaces/survey.interface';
import { Category, CategorySchema } from './category.model';

@Schema({ autoIndex: true, timestamps: true })
export class Survey extends Document implements SurveyI {
  _id?: string | Types.ObjectId;

  @ApiProperty()
  @Prop({ default: '', required: true })
  title: string;

  @ApiPropertyOptional()
  @Prop({ type: [CategorySchema], default: [], required: true })
  categories?: Category[];

  @ApiProperty()
  @Prop({ default: false, required: true })
  isPublic: boolean;

  @ApiProperty()
  @Prop({ default: 0, required: true })
  amountOfQuestions: number;

  @ApiProperty()
  @Prop({ default: false, required: true })
  archived: boolean;
}
export const SurveySchema = SchemaFactory.createForClass(Survey);
