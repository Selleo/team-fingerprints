import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleType } from 'src/role/role.type';
import { RoleI } from '../interfaces/role.interface';

@Schema({ autoIndex: false, timestamps: true })
export class Role extends Document implements RoleI {
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

export const RoleSchema = SchemaFactory.createForClass(Role);
