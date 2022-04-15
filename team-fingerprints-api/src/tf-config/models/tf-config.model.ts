import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ autoIndex: true })
export class TfConfig {
  _id?: string;

  @Prop({ required: false, unique: true })
  name: string;

  @Prop(raw({}))
  data: any;

  @Prop({ required: false, default: 0 })
  counter: number;
}

export const TfConfigSchema = SchemaFactory.createForClass(TfConfig);
