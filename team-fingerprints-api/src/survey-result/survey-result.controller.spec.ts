import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResultController } from './survey-result.controller';

describe('SurveyResultController', () => {
  let controller: SurveyResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyResultController],
    }).compile();

    controller = module.get<SurveyResultController>(SurveyResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
