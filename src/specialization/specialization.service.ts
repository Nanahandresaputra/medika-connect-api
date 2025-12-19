import { Injectable } from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { FilterData } from 'src/types/filter-data.type';

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

  async findAll({ page, limit, search }: FilterData) {
    try {
      const specializationList = await this.prisma.specialization.findMany({
        where: {
          ...(search && {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }),
        },
        ...(page && limit && {
            skip: limit * (page - 1),
          }),
        ...(page && limit && { take: limit }),
      });

      const respSpecialization: SpecializationInterface[] = specializationList;

      return new SuccessResponseService().getResponse(respSpecialization);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async update(id: number, updateSpecializationDto: UpdateSpecializationDto) {
    try {
      await this.prisma.specialization.update({
        data: { name: updateSpecializationDto.name },
        where: { id },
      });

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.specialization.delete({ where: { id } });

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
