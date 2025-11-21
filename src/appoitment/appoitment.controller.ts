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
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { AppoitmentPolicies } from 'src/casl/policies.entity';
import { PoliciesGuard } from 'src/casl/policies.guard';

@Controller('appoitment')
@UseGuards(AuthGuard)
@UseGuards(PoliciesGuard)
export class AppoitmentController {
  constructor(private readonly appoitmentService: AppoitmentService) {}

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, AppoitmentPolicies),
  )
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createAppoitmentDto: CreateAppoitmentDto) {
    return this.appoitmentService.create(createAppoitmentDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, AppoitmentPolicies),
  )
  @Get()
  findAll(
    @Query('doctor_id') doctor_id: string,
    @Query('patient_id') patient_id: string,
  ) {
    return this.appoitmentService.findAll(+doctor_id, +patient_id);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, AppoitmentPolicies),
  )
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateAppoitmentDto: UpdateAppoitmentDto,
  ) {
    return this.appoitmentService.update(+id, updateAppoitmentDto);
  }
}
