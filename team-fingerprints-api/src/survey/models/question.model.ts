import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { QuestionI } from '../interfaces/survey.interface';

@Schema()
export class Question implements QuestionI {
  _id?: string | Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  primary: boolean;
}
export const QuestionSchema = SchemaFactory.createForClass(Question);
