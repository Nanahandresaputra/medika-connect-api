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
import { SpecializationService } from './specialization.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('specialization')
export class SpecializationController {
  constructor(private readonly specializationService: SpecializationService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createSpecializationDto: CreateSpecializationDto) {
    return this.specializationService.create(createSpecializationDto);
  }

  @Get()
  findAll() {
    return this.specializationService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpecializationDto: UpdateSpecializationDto,
  ) {
    return this.specializationService.update(+id, updateSpecializationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specializationService.remove(+id);
  }
}
