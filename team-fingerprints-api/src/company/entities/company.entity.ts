import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Team, TeamSchema } from './team.entity';

@Schema({ autoIndex: true, timestamps: true })
export class Company extends Document {
  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop()
  logo?: string;

  @Prop({ type: [TeamSchema], default: [], required: true })
  teams: Team[];

  @Prop({ required: true, default: [] })
  adminId: string[];

  @Prop({ required: true, default: [] })
  surves: string[];

  @Prop({ default: [] })
  emailDomain: string[];

  @Prop({ default: [] })
  emailWhitelist: string[];

  @Prop({ default: [] })
  users: string[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
