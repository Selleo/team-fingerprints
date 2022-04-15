import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { Survey } from 'src/survey/models/survey.model';
import { TfConfigService } from 'src/tf-config/tf-config.service';
import { UsersService } from 'src/users/users.service';
import { SurveyResultService } from './survey-result.service';

@Processor('count-points')
export class SurveyResultProcessor {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
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

  @Process('count')
  async countPoints(job: Job) {
    const usersIds = await this.surveyResultService.getUsersIds();
    const filteredUsersIds = await this.usersService.getUsersIdsByUserDetails(
      usersIds,
    );
    try {
      const result = await this.surveyResultService.countPoints(
        job.data.surveyId,
        filteredUsersIds,
      );

      const currentResults = await this.tfConfigService.getGlobalSurveysResults(
        job.data.surveyId,
      );

      if (!currentResults) {
        await this.tfConfigService.createGlobalSurveysResults(
          job.data.surveyId,
          result,
        );
      } else {
        await this.tfConfigService.updateGlobalSurveysResults(
          job.data.surveyId,
          result,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
