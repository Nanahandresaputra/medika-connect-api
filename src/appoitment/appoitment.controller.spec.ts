import { Test, TestingModule } from '@nestjs/testing';
import { AppoitmentController } from './appoitment.controller';
import { AppoitmentService } from './appoitment.service';

describe('AppoitmentController', () => {
  let controller: AppoitmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppoitmentController],
      providers: [AppoitmentService],
    }).compile();

    controller = module.get<AppoitmentController>(AppoitmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
