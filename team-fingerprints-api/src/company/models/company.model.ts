import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Company, FilterTemplate } from 'team-fingerprints-common';
import { TeamModel, TeamSchema } from './team.model';

@Schema({ collection: 'companies', autoIndex: false, timestamps: true })
export class CompanyModel extends Document implements Company {
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
  filterTemplates: FilterTemplate[];
}

export const CompanySchema = SchemaFactory.createForClass(CompanyModel);
