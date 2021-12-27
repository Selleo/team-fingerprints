import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ResultSchema, Result } from './result.entity';

@Schema()
export class SurveysResult {
  @Prop({ required: true })
  surveyId: string;

  @Prop({ type: [ResultSchema], required: true })
  result: Result[];
}
export const SurveysResultSchema = SchemaFactory.createForClass(SurveysResult);
