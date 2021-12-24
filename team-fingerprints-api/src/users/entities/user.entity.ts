import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../Roles/UserRoles.enum';
import {
  UserSurveyResponseSchema,
  UserSurveyResponse,
} from './userSurveyResponse.entity';

@Schema({ autoIndex: true, timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: UserRole.USER, required: true })
  role: UserRole;

  @Prop({ default: '' })
  team?: string;

  @Prop({ default: '' })
  url?: string;

  @Prop({ type: [UserSurveyResponseSchema], default: [], required: true })
  surveysResponses: UserSurveyResponse[];
}

export const UserSchema = SchemaFactory.createForClass(User);
