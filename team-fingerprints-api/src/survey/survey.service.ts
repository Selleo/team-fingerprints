import { Injectable } from '@nestjs/common';

@Injectable()
export class SurveyService {
  helloWorld(): string {
    return 'helloooo wooorlddd';
  }
}
