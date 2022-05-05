import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { FilterTemplate, Team } from 'team-fingerprints-common';

@Schema({ autoIndex: false })
export class TeamModel implements Team {
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
  filterTemplates: FilterTemplate[];
}
export const TeamSchema = SchemaFactory.createForClass(TeamModel);
