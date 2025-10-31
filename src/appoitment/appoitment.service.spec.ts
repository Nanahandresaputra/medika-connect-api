import { Test, TestingModule } from '@nestjs/testing';
import { AppoitmentService } from './appoitment.service';

describe('AppoitmentService', () => {
  let service: AppoitmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppoitmentService],
    }).compile();

    service = module.get<AppoitmentService>(AppoitmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
