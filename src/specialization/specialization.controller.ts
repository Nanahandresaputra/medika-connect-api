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
  Query,
} from '@nestjs/common';
import { SpecializationService } from './specialization.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { SpecializationPolicies } from 'src/casl/policies.entity';
import { RequestCreateSpecializationDto } from './dto/request-create-specialization.dto';
import { RequestUpdateSpecializationDto } from './dto/request-update-specialization.dto';
import { WebFilterDto } from 'src/common-dto/web-filter.dto';

@UseGuards(AuthGuard)
@UseGuards(PoliciesGuard)
@Controller('specialization')
export class SpecializationController {
  constructor(private readonly specializationService: SpecializationService) {}

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, SpecializationPolicies),
  )
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createSpecializationDto: RequestCreateSpecializationDto) {
    return this.specializationService.create(createSpecializationDto);
  }

  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Manage, SpecializationPolicies) ||
      ability.can(Action.Read, SpecializationPolicies),
  )
  @Get()
  findAll(@Query() filterDto: WebFilterDto) {
    return this.specializationService.findAll(filterDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, SpecializationPolicies),
  )
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateSpecializationDto: RequestUpdateSpecializationDto,
  ) {
    return this.specializationService.update(+id, updateSpecializationDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, SpecializationPolicies),
  )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specializationService.remove(+id);
  }
}
