import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ autoIndex: false })
export class Team {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    default: [null],
    type: [String],
    excludeIndexes: true,
    index: false,
  })
  members?: string[];

  @Prop({
    default: [null],
    type: [String],
    excludeIndexes: true,
    index: false,
  })
  emailWhitelist?: string[];

  @Prop()
  teamLeader?: string;
}
export const TeamSchema = SchemaFactory.createForClass(Team);
