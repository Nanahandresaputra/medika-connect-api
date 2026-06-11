import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config/config';
import { JwtDecodeInterface } from 'src/types/jwt-decode.type';
import { RequestCreatePatientDto } from './dto/request-create-patient.dto';
import { WebResponseDto } from 'src/common-dto/web-response.dto';
import { WebFilterDto } from 'src/common-dto/web-filter.dto';
import { ResponsePatientDto } from './dto/response-patient.dto';
import { RequestUpdatePatientDto } from './dto/request-update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }
  async create(createPatientDto: RequestCreatePatientDto): Promise<WebResponseDto> {
    await this.prisma.patient.create({ data: createPatientDto });

    return {
      message: 'Success',
    };
  }

  async findAllForAdmin({ limit, page, search }: WebFilterDto): Promise<ResponsePatientDto[]> {
    const patientDatas = await this.prisma.patient.findMany({
      where: {
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
      },
      ...(page &&
        limit && {
        skip: limit * (page - 1),
      }),
      ...(page && limit && { take: limit }),
    });

    return patientDatas;
  }

  async findAllByUser(authorization: string): Promise<ResponsePatientDto[]> {
    const tokenData: string = authorization.replace('Bearer ', '');
    const payload: JwtDecodeInterface = await this.jwtService.verifyAsync(
      tokenData,
      {
        secret: config.key,
      },
    );
    const patientDatas = await this.prisma.patient.findMany({
      where: { user_id: payload.id },
    });


    return patientDatas;
  }

  async update(id: number, updatePatientDto: RequestUpdatePatientDto): Promise<WebResponseDto> {
    await this.prisma.patient.update({
      data: updatePatientDto,
      where: { id },
    });

    return {
      message: 'Success',
    };
  }
}
