import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AppoitmentService } from './appoitment.service';
import { CreateAppoitmentDto } from './dto/create-appoitment.dto';
import { UpdateAppoitmentDto } from './dto/update-appoitment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('appoitment')
export class AppoitmentController {
  constructor(private readonly appoitmentService: AppoitmentService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createAppoitmentDto: CreateAppoitmentDto) {
    return this.appoitmentService.create(createAppoitmentDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('doctor_id') doctor_id: string,
    @Query('patient_id') patient_id: string,
  ) {
    return this.appoitmentService.findAll(+doctor_id, +patient_id);
  }
}
