import { Prop, SchemaFactory, Schema, raw } from '@nestjs/mongoose';

@Schema({ autoIndex: false })
export class Team {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  pointColor: string;

  @Prop()
  pointShape: string;

  @Prop({
    type: [String],
    excludeIndexes: true,
    index: false,
  })
  members?: string[];

  @Prop({
    type: [String],
    excludeIndexes: true,
    index: false,
  })
  emailWhitelist?: string[];

  @Prop(raw({ _id: String, email: String }))
  teamLeader?: any;
}
export const TeamSchema = SchemaFactory.createForClass(Team);
