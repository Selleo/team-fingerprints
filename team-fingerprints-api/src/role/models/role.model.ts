import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role, RoleType } from 'team-fingerprints-common';

@Schema({ collection: 'roles', autoIndex: false, timestamps: true })
export class RoleModel extends Document implements Role {
  _id?: string;

  @Prop({ required: true, unique: false })
  email: string;

  @Prop({ default: RoleType.USER, required: true })
  role: RoleType;

  @Prop({ required: false })
  userId: string;

  @Prop({ required: false })
  companyId: string;

  @Prop({ required: false })
  teamId: string;
}

export const RoleSchema = SchemaFactory.createForClass(RoleModel);
