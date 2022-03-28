import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ autoIndex: true })
export class TfConfig {
  _id?: string;

  @Prop({ required: false, unique: true })
  name: string;

  @Prop(raw({}))
  data: any;
}

export const TfConfigSchema = SchemaFactory.createForClass(TfConfig);
