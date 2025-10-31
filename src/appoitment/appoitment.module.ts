import { Module } from '@nestjs/common';
import { AppoitmentService } from './appoitment.service';
import { AppoitmentController } from './appoitment.controller';

@Module({
  controllers: [AppoitmentController],
  providers: [AppoitmentService],
})
export class AppoitmentModule {}
