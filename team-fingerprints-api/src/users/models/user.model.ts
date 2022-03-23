import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDetailI, UserI } from '../interfaces/user.interface';
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

  @Prop({
    type: [UserSurveyAnswerSchema],
    default: [],
    excludeIndexes: true,
    required: true,
  })
  surveysAnswers: UserSurveyAnswer[];

  @Prop(raw({}))
  userDetails?: UserDetailI[];
}

export const UserSchema = SchemaFactory.createForClass(User);
