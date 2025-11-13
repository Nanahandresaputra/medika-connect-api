import {
  Controller,
  Get,
  Post,
  Body,
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

@Controller('media-information')
export class MediaInformationController {
  constructor(
    private readonly mediaInformationService: MediaInformationService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Headers('Authorization') authorization: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaInformationService.create(authorization, file);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.mediaInformationService.findAll();
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaInformationService.update(+id, authorization, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaInformationService.remove(+id);
  }
}
