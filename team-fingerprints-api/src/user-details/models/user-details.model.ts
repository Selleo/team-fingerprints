import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  UserDetailsValueSchema,
  UserDetailsValue,
} from './user-details-value.model';

@Schema({ autoIndex: false, timestamps: true })
export class UserDetails extends Document {
  _id?: string;

  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: true, unique: false })
  filterPath: string;

  @Prop({ required: true, unique: false, default: false })
  savedInUser: boolean;

  @Prop({ type: [UserDetailsValueSchema], default: [] })
  values: UserDetailsValue[];
}

export const UserDetailsSchema = SchemaFactory.createForClass(UserDetails);
