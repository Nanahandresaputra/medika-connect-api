import { Injectable } from '@nestjs/common';
import { CreateAppoitmentDto } from './dto/create-appoitment.dto';
import { UpdateAppoitmentDto } from './dto/update-appoitment.dto';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';

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
            doctor_name?.name,
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
      });

      return new SuccessResponseService().getResponse(appoitmentData);
    } catch (error) {
      new ExceptionHandlerService().getResponse(error);
    }
  }
}
