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
    unique: true,
    excludeIndexes: true,
    type: [String],
    required: true,
  })
  members?: string[];

  @Prop({
    default: [],
    excludeIndexes: true,
    required: true,
    type: [String],
    unique: true,
  })
  emailWhitelist?: string[];

  @Prop()
  teamLeader?: string;
}
export const TeamSchema = SchemaFactory.createForClass(Team);
