import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Team, TeamSchema } from './team.model';

@Schema({ autoIndex: true, timestamps: true })
export class Company extends Document {
  _id?: string;

  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop()
  pointColor: string;

  @Prop()
  pointShape: string;

  @Prop({ type: [TeamSchema], default: [], required: true })
  teams: Team[];

  @Prop({ required: true, default: [] })
  adminId: string[];

  @Prop({ default: '', required: true, unique: true })
  domain: string;

  @Prop({
    type: [String],
    excludeIndexes: true,
    index: false,
  })
  emailWhitelist: string[];

  @Prop({
    type: [String],
    excludeIndexes: true,
    index: false,
  })
  members: string[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
