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
import { CreateMediaInformationDto } from './dto/create-media-information.dto';
import { UpdateMediaInformationDto } from './dto/update-media-information.dto';
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMediaInformationDto: UpdateMediaInformationDto,
  ) {
    return this.mediaInformationService.update(+id, updateMediaInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaInformationService.remove(+id);
  }
}
