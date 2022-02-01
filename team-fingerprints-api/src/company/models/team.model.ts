import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class Team {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    default: [],
    type: [String],
    required: true,
    index: false,
  })
  members?: string[];

  @Prop({
    default: [],
    required: true,
    type: [String],
    index: false,
  })
  emailWhitelist?: string[];

  @Prop()
  teamLeader?: string;
}
export const TeamSchema = SchemaFactory.createForClass(Team);
