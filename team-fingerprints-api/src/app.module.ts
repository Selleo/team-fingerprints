import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [
    SurveyModule,
    MongooseModule.forRoot('mongodb://localhost:27017/surveys'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
