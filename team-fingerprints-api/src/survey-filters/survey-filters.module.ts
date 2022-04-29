import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { FilterModule } from 'src/filter/filter.module';
import { SurveyResultModule } from 'src/survey-result/survey-result.module';
import { TfConfigModule } from 'src/tf-config/tf-config.module';
import { SurveyFiltersController } from './survey-filters.controller';
import { SurveyFiltersService } from './survey-filters.service';

@Module({
  imports: [
    forwardRef(() => TfConfigModule),
    forwardRef(() => SurveyResultModule),
    forwardRef(() => FilterModule),
    BullModule.registerQueueAsync({
      name: 'survey-filters',
    }),
  ],
  controllers: [SurveyFiltersController],
  providers: [SurveyFiltersService],
  exports: [SurveyFiltersService],
})
export class SurveyFiltersModule {}
