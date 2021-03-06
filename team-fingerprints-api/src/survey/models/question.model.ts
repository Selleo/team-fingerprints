import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Question } from 'team-fingerprints-common';

@Schema()
export class QuestionModel implements Question {
  _id?: string | Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  primary: boolean;
}
export const QuestionSchema = SchemaFactory.createForClass(QuestionModel);
