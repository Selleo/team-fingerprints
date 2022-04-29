import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'tfconfigs', autoIndex: false })
export class TfConfigModel {
  _id?: string;

  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: false, unique: false })
  surveyId: string;

  @Prop(raw({}))
  data: any;
}

export const TfConfigSchema = SchemaFactory.createForClass(TfConfigModel);
