import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ autoIndex: false })
export class Team {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: '' })
  pointShape: string;

  @Prop({ default: '' })
  pointColor: string;
}
export const TeamSchema = SchemaFactory.createForClass(Team);
