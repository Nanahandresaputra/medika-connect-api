import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { DashboardPolicies } from 'src/casl/policies.entity';
import { ResponseDashboarddDto } from './dto/response-dashboard.dto';

@UseGuards(AuthGuard)
@UseGuards(PoliciesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, DashboardPolicies),
  )
  @Get()
  findAll(): Promise<ResponseDashboarddDto> {
    return this.dashboardService.findAll();
  }
}
