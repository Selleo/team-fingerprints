import { Test, TestingModule } from '@nestjs/testing';
import { UserDetailsService } from './user-details.service';

describe('UserDetailsService', () => {
  let service: UserDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDetailsService],
    }).compile();

    service = module.get<UserDetailsService>(UserDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
