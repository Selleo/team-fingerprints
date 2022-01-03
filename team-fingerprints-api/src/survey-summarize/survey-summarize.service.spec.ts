import { Test, TestingModule } from '@nestjs/testing';
import { SurveySummarizeService } from './survey-summarize.service';

describe('SurveySummarizeService', () => {
  let service: SurveySummarizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveySummarizeService],
    }).compile();

    service = module.get<SurveySummarizeService>(SurveySummarizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
