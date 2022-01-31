import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ResultSchema, Result } from './result.model';

@Schema()
export class SurveysResult {
  @Prop({ required: true })
  surveyId: string;

  @Prop({
    type: [ResultSchema],
    required: true,
    excludeIndexes: true,
    default: [],
  })
  result: Result[];
}
export const SurveysResultSchema = SchemaFactory.createForClass(SurveysResult);
