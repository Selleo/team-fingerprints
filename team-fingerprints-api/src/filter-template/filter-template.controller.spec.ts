import { Test, TestingModule } from '@nestjs/testing';
import { FilterTemplateController } from './filter-template.controller';

describe('FilterTemplateController', () => {
  let controller: FilterTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilterTemplateController],
    }).compile();

    controller = module.get<FilterTemplateController>(FilterTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
