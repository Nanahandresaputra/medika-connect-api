import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { RequestCreateSpecializationDto } from './dto/request-create-specialization.dto';
import { WebResponseDto } from 'src/common-dto/web-response.dto';
import { WebFilterDto } from 'src/common-dto/web-filter.dto';
import { RequestUpdateSpecializationDto } from './dto/request-update-specialization.dto';
import { ResponseSpecializationDto } from './dto/response-specialization.dto';

@Injectable()
export class SpecializationService {
  constructor(private prisma: PrismaService) { }
  async create(createSpecializationDto: RequestCreateSpecializationDto): Promise<WebResponseDto> {
    await this.prisma.specialization.create({
      data: createSpecializationDto,
    });

    return {
      message: 'Success',
    };
  }

  async findAll({ page, limit, search }: WebFilterDto): Promise<ResponseSpecializationDto[]> {
    const specializationList = await this.prisma.specialization.findMany({
      where: {
        ...(search && {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      },
      ...(page &&
        limit && {
        skip: limit * (page - 1),
      }),
      ...(page && limit && { take: limit }),
    });



    return specializationList;
  }

  async update(
    id: number,
    updateSpecializationDto: RequestUpdateSpecializationDto,
  ): Promise<WebResponseDto> {
    await this.prisma.specialization.update({
      data: { name: updateSpecializationDto.name },
      where: { id },
    });

    const resp: WebResponseDto = {
      message: 'Success',
    };

    return resp;
  }

  async remove(id: number) {
    await this.prisma.specialization.delete({ where: { id } });

    return {
      message: 'Success',
    };
  }
}
