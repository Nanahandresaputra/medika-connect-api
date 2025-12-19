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
  UseInterceptors,
  Headers,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { DashboardPolicies, DoctorPolicies } from 'src/casl/policies.entity';

@UseGuards(AuthGuard)
@UseGuards(PoliciesGuard)
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, DoctorPolicies),
  )
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createDoctorDto: CreateDoctorDto,
    @Headers('Authorization') authorization: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.doctorService.create(createDoctorDto, authorization, file);
  }

  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Manage, DoctorPolicies) ||
      ability.can(Action.Read, DoctorPolicies),
  )
  @Get()
  findAll(@Query('page') page:string, @Query('limit') limit:string, @Query('search') search: string) {
    return this.doctorService.findAll({page:+page, limit:+limit, search});
  }

  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Manage, DoctorPolicies) ||
      ability.can(Action.Update, DoctorPolicies),
  )
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @Headers('Authorization') authorization: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.doctorService.update(+id, updateDoctorDto, authorization, file);
  }
}
