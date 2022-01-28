import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResultService } from './survey-result.service';

describe('SurveyResultService', () => {
  let service: SurveyResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyResultService],
    }).compile();

    service = module.get<SurveyResultService>(SurveyResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
