import { Injectable } from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';

@Injectable()
export class SpecializationService {
  constructor(private prisma: PrismaService) {}
  async create(createSpecializationDto: CreateSpecializationDto) {
    try {
      await this.prisma.specialization.create({
        data: createSpecializationDto,
      });

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  findAll() {
    return `This action returns all specialization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} specialization`;
  }

  update(id: number, updateSpecializationDto: UpdateSpecializationDto) {
    return `This action updates a #${id} specialization`;
  }

  remove(id: number) {
    return `This action removes a #${id} specialization`;
  }
}
