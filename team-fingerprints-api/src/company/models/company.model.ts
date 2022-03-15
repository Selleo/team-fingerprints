import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Team, TeamSchema } from './team.model';

@Schema({ autoIndex: false, timestamps: true })
export class Company extends Document {
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop()
  pointColor: string;

  @Prop()
  pointShape: string;

  @Prop({ type: [TeamSchema], default: [], required: true })
  teams: Team[];

  @Prop({ default: '', required: true, unique: true })
  domain: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
