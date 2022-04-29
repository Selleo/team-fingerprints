import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TeamModel, TeamSchema } from './team.model';

@Schema({ autoIndex: false, timestamps: true })
export class CompanyModel extends Document {
  _id?: string;

  @Prop()
  name: string;

  @Prop({ default: '' })
  description?: string;

  @Prop({ default: '' })
  pointColor: string;

  @Prop({ default: '' })
  pointShape: string;

  @Prop({ type: [TeamSchema], default: [], required: true })
  teams: TeamModel[];

  @Prop({ default: '', required: false, unique: true })
  domain: string;

  @Prop({ default: [], required: false })
  filterTemplates: any[];
}

export const CompanySchema = SchemaFactory.createForClass(CompanyModel);
