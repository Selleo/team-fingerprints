import { Test, TestingModule } from '@nestjs/testing';
import { TrendController } from './trend.controller';

describe('TrendController', () => {
  let controller: TrendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrendController],
    }).compile();

    controller = module.get<TrendController>(TrendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
