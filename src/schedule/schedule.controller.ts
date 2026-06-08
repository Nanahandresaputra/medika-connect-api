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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { SchedulePolicies } from 'src/casl/policies.entity';
import { RequestCreateScheduleDto } from './dto/request-create-schedule.dto';
import { RequestUpdateScheduleDto } from './dto/request-update-schedule.dto';
import { WebFilterDto } from 'src/common-dto/web-filter.dto';

@UseGuards(AuthGuard)
@UseGuards(PoliciesGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, SchedulePolicies),
  )
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createScheduleDto: RequestCreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Manage, SchedulePolicies) ||
      ability.can(Action.Read, SchedulePolicies),
  )
  @Get()
  findAll(@Query() filterDto: WebFilterDto) {
    return this.scheduleService.findAll(filterDto);
  }

  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Manage, SchedulePolicies) ||
      ability.can(Action.Read, SchedulePolicies),
  )
  @Get(':doctor_id')
  findOne(@Param('doctor_id') doctor_id: string) {
    return this.scheduleService.findOneByDoctor(+doctor_id);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, SchedulePolicies),
  )
  @Patch(':doctor_id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('doctor_id') doctor_id: string,
    @Body() updateScheduleDto: RequestUpdateScheduleDto,
  ) {
    return this.scheduleService.update(+doctor_id, updateScheduleDto);
  }
}
