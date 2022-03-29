import { Test, TestingModule } from '@nestjs/testing';
import { FilterTemplateService } from './filter-template.service';

describe('FilterTemplateService', () => {
  let service: FilterTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilterTemplateService],
    }).compile();

    service = module.get<FilterTemplateService>(FilterTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
