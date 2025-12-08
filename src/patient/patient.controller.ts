import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { PatientPolicies } from 'src/casl/policies.entity';

@UseGuards(AuthGuard)
@UseGuards(PoliciesGuard)
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, PatientPolicies),
  )
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, PatientPolicies),
  )
  @Get('/for-admin')
  findAllForAdmin() {
    return this.patientService.findAllForAdmin();
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, PatientPolicies),
  )
  @Get('/user/:user_id')
  findAll(@Param('user_id') user_id: string) {
    return this.patientService.findAllByUser(+user_id);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, PatientPolicies),
  )
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(+id, updatePatientDto);
  }
}
