import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('doctor_id') doctor_id: string,
    @Query('specialization_id') specialization_id: string,
    @Query('date') date: string,
  ) {
    return this.scheduleService.findAll(+doctor_id, +specialization_id, date);
  }

  @UseGuards(AuthGuard)
  @Get(':doctor_id')
  findOne(@Param('doctor_id') doctor_id: string) {
    return this.scheduleService.findOneByDoctor(+doctor_id);
  }

  @UseGuards(AuthGuard)
  @Patch(':doctor_id')
  update(
    @Param('doctor_id') doctor_id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(+doctor_id, updateScheduleDto);
  }
}
