import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SurveyFiltersService } from 'src/survey-filters/survey-filters.service';
import { TfConfigService } from 'src/tf-config/tf-config.service';

@Processor('survey-filters')
export class SurveyResultProcessor {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly tfConfigService: TfConfigService,
    private readonly surveyFiltersService: SurveyFiltersService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processor:@OnQueueActive - Processing job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.log(
      `Processor:@OnQueueCompleted - Completed job ${job.id} of type ${
        job.name
      }. Result: ${JSON.stringify(result)}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.stack}`,
      error.stack,
    );
  }

  @Process('get-global-available-filters')
  async getGlobalAvailableFilters({ data }: Job) {
    try {
      const filters =
        await this.surveyFiltersService.getAvailableFiltersForCompanies(
          data.surveyId,
        );

      const currentFilters =
        await this.tfConfigService.getGlobalAvailableFilters(data.surveyId);

      if (!currentFilters) {
        await this.tfConfigService.createGlobalAvailableFilters(
          data.surveyId,
          filters,
        );
      } else {
        await this.tfConfigService.updateGlobalAvailableFilters(
          data.surveyId,
          filters,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
