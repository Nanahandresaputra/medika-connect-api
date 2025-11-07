import { Module } from '@nestjs/common';
import { MediaInformationService } from './media-information.service';
import { MediaInformationController } from './media-information.controller';

@Module({
  controllers: [MediaInformationController],
  providers: [MediaInformationService],
})
export class MediaInformationModule {}
