import { Injectable } from '@nestjs/common';
import { CreateAppoitmentDto } from './dto/create-appoitment.dto';
import { UpdateAppoitmentDto } from './dto/update-appoitment.dto';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { AppoitmentResponse } from './interfaces/appoitment.interface';

@Injectable()
export class AppoitmentService {
  constructor(
    private helpers: HelpersService,
    private prisma: PrismaService,
  ) {}
  async create(createAppoitmentDto: CreateAppoitmentDto) {
    try {
      const doctor_name = await this.prisma.doctor.findUnique({
        where: { id: createAppoitmentDto.doctor_id },
      });
      await this.prisma.appoitment.create({
        data: {
          ...createAppoitmentDto,
          appoitment_code: this.helpers.generateAppoitmentCode(
            doctor_name?.name ?? '',
          ),
        },
      });

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAll(doctor_id: number, patient_id: number) {
    try {
      const appoitmentData = await this.prisma.appoitment.findMany({
        where: {
          ...(doctor_id && { doctor_id }),
          ...(patient_id && { patient_id }),
        },
        select: {
          id: true,
          doctor: {
            select: { name: true, specialization: { select: { name: true } } },
          },
          patient: { select: { name: true } },
          date_time: true,
          appoitment_code: true,
        },
      });

      const respData: AppoitmentResponse[] = appoitmentData.map((data) => ({
        id: data.id,
        doctor: data.doctor.name,
        patient: data.patient.name,
        category: data.doctor.specialization.name,
        date_time: data.date_time,
        appoitment_code: data.appoitment_code,
      }));

      return new SuccessResponseService().getResponse(respData);
    } catch (error) {
      new ExceptionHandlerService().getResponse(error);
    }
  }
}
