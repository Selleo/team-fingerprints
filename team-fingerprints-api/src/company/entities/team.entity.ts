import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { SurveysResult, SurveysResultSchema } from './surveyResult.entity';

@Schema()
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, default: [] })
  members: string[];

  @Prop({ required: true, default: [] })
  emailWhitelist: string[];

  @Prop({ required: true, default: [] })
  teamLeader: string[];

  @Prop({ type: [SurveysResultSchema], required: true, default: [] })
  surveyResults: SurveysResult[];
}
export const TeamSchema = SchemaFactory.createForClass(Team);
