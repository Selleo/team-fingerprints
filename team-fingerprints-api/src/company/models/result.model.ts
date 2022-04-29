import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class ResultModel {
  @Prop({ required: true })
  trendId: string;

  @Prop({ required: true })
  avgValue: number;
}
export const ResultSchema = SchemaFactory.createForClass(ResultModel);
