import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { SurveysResult, SurveysResultSchema } from './surveyResult.entity';

@Schema()
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: [] })
  members: string[];

  @Prop({ default: [] })
  emailWhitelist: string[];

  @Prop({ default: [] })
  teamLeader: string[];

  @Prop({ type: [SurveysResultSchema] })
  surveyResults: SurveysResult[];
}
export const TeamSchema = SchemaFactory.createForClass(Team);
