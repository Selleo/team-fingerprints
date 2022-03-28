import { Test, TestingModule } from '@nestjs/testing';
import { TfConfigService } from './tf-config.service';

describe('TfConfigService', () => {
  let service: TfConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TfConfigService],
    }).compile();

    service = module.get<TfConfigService>(TfConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
