import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
  Query,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { PatientPolicies } from 'src/casl/policies.entity';
import { RequestCreatePatientDto } from './dto/request-create-patient.dto';
import { RequestUpdatePatientDto } from './dto/request-update-patient.dto';
import { WebFilterDto } from 'src/common-dto/web-filter.dto';
import { WebResponseDto } from 'src/common-dto/web-response.dto';
import { ResponsePatientDto } from './dto/response-patient.dto';

@UseGuards(AuthGuard)
@UseGuards(PoliciesGuard)
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) { }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, PatientPolicies),
  )
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createPatientDto: RequestCreatePatientDto): Promise<WebResponseDto> {
    return this.patientService.create(createPatientDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, PatientPolicies),
  )
  @Get('/for-admin')
  findAllForAdmin(@Query() filterDto: WebFilterDto): Promise<ResponsePatientDto[]> {
    return this.patientService.findAllForAdmin(filterDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, PatientPolicies),
  )
  @Get('/user')
  findAll(@Headers('Authorization') authorization: string): Promise<ResponsePatientDto[]> {
    return this.patientService.findAllByUser(authorization);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, PatientPolicies),
  )
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: RequestUpdatePatientDto,
  ): Promise<WebResponseDto> {
    return this.patientService.update(+id, updatePatientDto);
  }
}
