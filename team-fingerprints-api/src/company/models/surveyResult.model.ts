import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ResultSchema, ResultModel } from './result.model';

@Schema()
export class SurveysResultModel {
  @Prop({ required: true })
  surveyId: string;

  @Prop({
    type: [ResultSchema],
    required: true,
    excludeIndexes: true,
    default: [],
  })
  result: ResultModel[];
}
export const SurveysResultSchema =
  SchemaFactory.createForClass(SurveysResultModel);
