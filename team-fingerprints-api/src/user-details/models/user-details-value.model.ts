import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ autoIndex: false, timestamps: false })
export class UserDetailsValue extends Document {
  _id?: string;

  @Prop({ required: false, unique: false })
  value: string;
}

export const UserDetailsValueSchema =
  SchemaFactory.createForClass(UserDetailsValue);
