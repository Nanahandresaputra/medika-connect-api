import { Injectable, Logger } from '@nestjs/common';
import { CreateAppoitmentDto } from './dto/create-appoitment.dto';
import { UpdateAppoitmentDto } from './dto/update-appoitment.dto';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { AppoitmentResponse } from './interfaces/appoitment.interface';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppoitmentService {
  private readonly logger = new Logger(AppoitmentService.name);
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
          status: 'reserved',
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
          status: true,
        },
      });

      const respData: AppoitmentResponse[] = appoitmentData.map((data) => ({
        id: data.id,
        doctor: data.doctor.name,
        patient: data.patient.name,
        category: data.doctor.specialization.name,
        date_time: data.date_time,
        appoitment_code: data.appoitment_code,
        status: data.status,
      }));

      return new SuccessResponseService().getResponse(respData);
    } catch (error) {
      new ExceptionHandlerService().getResponse(error);
    }
  }

  async update(id: number, uppdateAppoitmentDto: UpdateAppoitmentDto) {
    try {
      await this.prisma.appoitment.update({
        where: { id },
        data: uppdateAppoitmentDto,
      });
      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  @Cron('0 30 00 * * 1-7') // real scheduller date and time => everyday 00:30 triggered
  //@Cron('1 * * * * *') // for development testing
  async appoitmentScheduler() {
    try {
      const appoitmentData: [] = await this.prisma
        .$queryRaw`select * from (select a.id , a.doctor_id , a.patient_id , a.appoitment_code ,
        cast(a.date_time as date) as date , a.created_at, a.status  from appoitment a where a.status = 'reserved') as sub
        where date < now() order by date asc`;

      const updateStatusToCancel = appoitmentData.map((data: any) => {
        return this.prisma.appoitment.updateMany({
          data: { status: 'canceled' },
          where: { id: data.id },
        });
      });

      if (appoitmentData.length > 0) {
        await this.prisma.$transaction(updateStatusToCancel);
        this.logger.debug(`${appoitmentData.length} appoitment data expired`);
      } else {
        this.logger.debug('not data expired');
      }
    } catch (error) {
      this.logger.debug('expired appoitment failed');
    }
  }
}
