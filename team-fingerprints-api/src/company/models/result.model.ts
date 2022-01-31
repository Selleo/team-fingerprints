import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class Result {
  @Prop({ required: true })
  trendId: string;

  @Prop({ required: true })
  avgValue: number;
}
export const ResultSchema = SchemaFactory.createForClass(Result);
