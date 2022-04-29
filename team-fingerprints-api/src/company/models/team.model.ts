import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ autoIndex: false })
export class TeamModel {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: '' })
  pointShape: string;

  @Prop({ default: '' })
  pointColor: string;

  @Prop({ default: [], required: false })
  filterTemplates: any[];
}
export const TeamSchema = SchemaFactory.createForClass(TeamModel);
