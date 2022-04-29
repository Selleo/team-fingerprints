import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDetail, User } from 'team-fingerprints-common';
import {
  UserSurveyAnswerModel,
  UserSurveyAnswerSchema,
} from './user-survey-answer.model';

@Schema({ collection: 'users', autoIndex: false, timestamps: true })
export class UserModel extends Document implements User {
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

  @Prop({ default: false })
  inCompany: boolean;

  @Prop({
    type: [UserSurveyAnswerSchema],
    default: [],
    excludeIndexes: true,
    required: true,
  })
  surveysAnswers: UserSurveyAnswerModel[];

  @Prop(raw({}))
  userDetails?: UserDetail[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
