import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../Roles/UserRoles.enum';
import {
  UserSurveyAnswerSchema,
  UserSurveyAnswer,
} from './userSurveyAnswer.entity';

@Schema({ autoIndex: true, timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  authId: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  pictureUrl?: string;

  @Prop({ default: UserRole.USER, required: true })
  role: UserRole;

  @Prop({ default: '' })
  team?: string;

  @Prop({ default: '' })
  url?: string;

  @Prop({ type: [UserSurveyAnswerSchema], default: [], required: true })
  surveysAnswers: UserSurveyAnswer[];
}

export const UserSchema = SchemaFactory.createForClass(User);
