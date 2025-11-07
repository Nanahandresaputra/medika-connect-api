import { Test, TestingModule } from '@nestjs/testing';
import { MediaInformationController } from './media-information.controller';
import { MediaInformationService } from './media-information.service';

describe('MediaInformationController', () => {
  let controller: MediaInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaInformationController],
      providers: [MediaInformationService],
    }).compile();

    controller = module.get<MediaInformationController>(MediaInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
