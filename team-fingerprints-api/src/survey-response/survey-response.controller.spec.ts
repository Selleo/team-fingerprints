import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResponseController } from './survey-response.controller';

describe('SurveyRresponseController', () => {
  let controller: SurveyResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyResponseController],
    }).compile();

    controller = module.get<SurveyResponseController>(SurveyResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
