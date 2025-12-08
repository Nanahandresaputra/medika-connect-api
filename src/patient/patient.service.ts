import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}
  async create(createPatientDto: CreatePatientDto) {
    try {
      await this.prisma.patient.create({ data: createPatientDto });
      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAllForAdmin() {
    try {
      const patientDatas = await this.prisma.patient.findMany({});
      return new SuccessResponseService().getResponse(patientDatas);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
  async findAllByUser(user_id: number) {
    try {
      const patientDatas = await this.prisma.patient.findMany({
        where: { user_id },
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
