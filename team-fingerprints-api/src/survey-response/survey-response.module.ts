import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { SurveyResponseController } from './survey-response.controller';
import { SurveyResponseService } from './survey-response.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [SurveyResponseController],
  providers: [SurveyResponseService],
})
export class SurveyRresponseModule {}
