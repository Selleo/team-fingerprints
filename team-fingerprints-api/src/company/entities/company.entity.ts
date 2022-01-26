import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Team, TeamSchema } from './team.entity';

@Schema({ autoIndex: true, timestamps: true })
export class Company extends Document {
  _id?: string;

  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop({ type: [TeamSchema], default: [], required: true })
  teams: Team[];

  @Prop({ required: true, default: [] })
  adminId: string[];

  @Prop({ default: '', required: true, unique: true })
  domain: string;

  @Prop({ default: [], unique: true, type: [String] })
  emailWhitelist: string[];

  @Prop({ default: [] })
  members: string[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
