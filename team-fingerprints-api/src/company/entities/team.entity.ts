import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { SurveysResult, SurveysResultSchema } from './surveyResult.entity';

@Schema()
export class Team {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: [], unique: true })
  members: string[];

  @Prop({ default: [] })
  emailWhitelist: string[];

  @Prop()
  teamLeader: string;

  @Prop({ type: [SurveysResultSchema] })
  surveyResults: SurveysResult[];
}
export const TeamSchema = SchemaFactory.createForClass(Team);
