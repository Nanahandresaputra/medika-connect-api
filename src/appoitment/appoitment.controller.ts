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
import { AuthGuard } from 'src/auth/auth.guard';
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { AppoitmentPolicies } from 'src/casl/policies.entity';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { RequestCreateAppoitmentDto } from './dto/request-create-appoitment.dto';
import { RequestUpdateAppoitmentDto } from './dto/request-update-appoitment.dto';
import { WebFilterDto } from 'src/common-dto/web-filter.dto';

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
  create(@Body() createAppoitmentDto: RequestCreateAppoitmentDto) {
    return this.appoitmentService.create(createAppoitmentDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, AppoitmentPolicies),
  )
  @Get()
  findAll(@Query() filterDto: WebFilterDto) {
    return this.appoitmentService.findAll(filterDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, AppoitmentPolicies),
  )
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateAppoitmentDto: RequestUpdateAppoitmentDto,
  ) {
    return this.appoitmentService.update(+id, updateAppoitmentDto);
  }
}
