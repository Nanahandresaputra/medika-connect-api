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
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @UseGuards(AuthGuard)
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

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.doctorService.findAll();
  }

  @UseGuards(AuthGuard)
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
