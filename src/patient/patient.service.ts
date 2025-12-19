import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config/config';
import { JwtDecodeInterface } from 'src/types/jwt-decode.type';
import { FilterData } from 'src/types/filter-data.type';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService, private jwtService: JwtService,) {}
  async create(createPatientDto: CreatePatientDto) {
    try {
      await this.prisma.patient.create({ data: createPatientDto });
      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAllForAdmin({limit, page, search}:FilterData) {
    try {
      const patientDatas = await this.prisma.patient.findMany({
        where: {...(search && {name: {contains: search, mode: 'insensitive'}}),},
        ...(page && limit && {
            skip: limit * (page - 1),
          }),
        ...(page && limit && { take: limit }),
      });
      return new SuccessResponseService().getResponse(patientDatas);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAllByUser(authorization:string) {
     const tokenData:string = authorization.replace('Bearer ', '');
        const payload:JwtDecodeInterface = await this.jwtService.verifyAsync(tokenData, {
             secret: config.key,
           });

    try {
      const patientDatas = await this.prisma.patient.findMany({
        where: { user_id: payload.id },
      });
      return new SuccessResponseService().getResponse(patientDatas);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    try {
      await this.prisma.patient.update({
        data: updatePatientDto,
        where: { id },
      });

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
