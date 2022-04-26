import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ autoIndex: false })
export class TfConfig {
  _id?: string;

  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: false, unique: false })
  surveyId: string;

  @Prop(raw({}))
  data: any;
}

export const TfConfigSchema = SchemaFactory.createForClass(TfConfig);
