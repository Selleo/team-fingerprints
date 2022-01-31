import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/role/role.type';
import { UserI } from '../interfaces/user.interface';
import {
  UserSurveyAnswer,
  UserSurveyAnswerSchema,
} from './user-survey-answer.model';

@Schema({ autoIndex: true, timestamps: true })
export class User extends Document implements UserI {
  _id?: string;

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

  @Prop({ default: Role.USER, required: true })
  role: Role;

  @Prop({ default: '' })
  companyId: string;

  @Prop({
    type: [UserSurveyAnswerSchema],
    default: [],
    excludeIndexes: true,
    required: true,
  })
  surveysAnswers: UserSurveyAnswer[];
}

export const UserSchema = SchemaFactory.createForClass(User);
