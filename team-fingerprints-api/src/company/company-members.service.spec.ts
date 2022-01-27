import { Test, TestingModule } from '@nestjs/testing';
import { CompanyMembersService } from './company-members.service';

describe('CompanyMembersService', () => {
  let service: CompanyMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyMembersService],
    }).compile();

    service = module.get<CompanyMembersService>(CompanyMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
