import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Role, RoleType } from 'team-fingerprints-common';

@Schema({ collection: 'roles', autoIndex: false, timestamps: true })
export class RoleModel extends Document implements Role {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  @Prop({ required: true, unique: false })
  email: string;

  @ApiProperty()
  @Prop({ default: RoleType.USER, required: true })
  role: RoleType;

  @ApiProperty()
  @Prop({ required: false })
  userId: string;

  @ApiProperty()
  @Prop({ required: false })
  companyId: string;

  @ApiProperty()
  @Prop({ required: false })
  teamId: string;
}

export const RoleSchema = SchemaFactory.createForClass(RoleModel);
