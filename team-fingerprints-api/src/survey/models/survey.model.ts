import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Survey } from 'team-fingerprints-common';
import { CategoryModel, CategorySchema } from './category.model';

@Schema({ collection: 'surveys', autoIndex: true, timestamps: true })
export class SurveyModel extends Document implements Survey {
  _id?: string | Types.ObjectId;

  @ApiProperty()
  @Prop({ default: '', required: true })
  title: string;

  @ApiPropertyOptional()
  @Prop({ type: [CategorySchema], default: [], required: true })
  categories?: CategoryModel[];

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
export const SurveySchema = SchemaFactory.createForClass(SurveyModel);
