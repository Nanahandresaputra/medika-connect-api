import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Headers,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { MediaInformationService } from './media-information.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { MediaInformationPolicies } from 'src/casl/policies.entity';
import { WebResponseDto } from 'src/common-dto/web-response.dto';
import { ResponseMediaDto } from './dto/response-media.dto';

@UseGuards(AuthGuard)
@UseGuards(PoliciesGuard)
@Controller('media-information')
export class MediaInformationController {
  constructor(
    private readonly mediaInformationService: MediaInformationService,
  ) { }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, MediaInformationPolicies),
  )
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Headers('Authorization') authorization: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponseDto> {
    return this.mediaInformationService.create(authorization, file);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(
      Action.Manage,
      MediaInformationPolicies ||
      ability.can(Action.Read, MediaInformationPolicies),
    ),
  )
  @Get()
  findAll(): Promise<ResponseMediaDto[]> {
    return this.mediaInformationService.findAll();
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, MediaInformationPolicies),
  )
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponseDto> {
    return this.mediaInformationService.update(+id, authorization, file);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, MediaInformationPolicies),
  )
  @Delete(':id')
  remove(@Param('id') id: string): Promise<WebResponseDto> {
    return this.mediaInformationService.remove(+id);
  }
}
