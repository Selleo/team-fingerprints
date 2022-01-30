import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionI } from '../interfaces/survey.interface';

@Schema()
export class Question implements QuestionI {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  primary: boolean;
}
export const QuestionSchema = SchemaFactory.createForClass(Question);
