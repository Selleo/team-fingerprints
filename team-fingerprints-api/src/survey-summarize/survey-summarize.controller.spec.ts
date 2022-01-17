import { Test, TestingModule } from '@nestjs/testing';
import { SurveySummarizeController } from './survey-summarize.controller';

describe('SurveySummarizeController', () => {
  let controller: SurveySummarizeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveySummarizeController],
    }).compile();

    controller = module.get<SurveySummarizeController>(
      SurveySummarizeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
