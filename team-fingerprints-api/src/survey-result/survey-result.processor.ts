import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TfConfigService } from 'src/tf-config/tf-config.service';
import { UsersService } from 'src/users/users.service';
import { SurveyResultService } from './survey-result.service';

@Processor('survey-results')
export class SurveyResultProcessor {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly surveyResultService: SurveyResultService,
    private readonly tfConfigService: TfConfigService,
    private readonly usersService: UsersService,
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

  @Process('count-points')
  async countPoints({ data }: Job) {
    const usersIds = await this.surveyResultService.getUsersIds();
    const filteredUsersIds = await this.usersService.getUsersIdsByUserDetails(
      usersIds,
    );
    try {
      const result = await this.surveyResultService.countPoints(
        data.surveyId,
        filteredUsersIds,
      );

      const currentResults = await this.tfConfigService.getGlobalSurveysResults(
        data.surveyId,
      );

      if (!currentResults) {
        await this.tfConfigService.createGlobalSurveysResults(
          data.surveyId,
          result,
        );
      } else {
        await this.tfConfigService.updateGlobalSurveysResults(
          data.surveyId,
          result,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
