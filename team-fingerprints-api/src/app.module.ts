import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [SurveyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
