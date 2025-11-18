import { Injectable, Logger } from '@nestjs/common';
import { CreateAppoitmentDto } from './dto/create-appoitment.dto';
import { UpdateAppoitmentDto } from './dto/update-appoitment.dto';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { AppoitmentResponse } from './interfaces/appoitment.interface';
import { Cron } from '@nestjs/schedule';
const moment = require('moment');

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

  // // @Cron('0 30 00 * * 1-7')
  // @Cron('1 * * * * *')
  // async appoitmentScheduler() {
  //   try {
  //     const getTodayDate = moment().format('YYYY-MM-DD');
  //     const appoitmentData = await this.prisma.appoitment.findMany({
  //       where: {
  //         status: 'reserved',
  //       },
  //     });

  //     const reservedList = appoitmentData.filter

  //     // const manyUpdate = reservedAppoitmentList.map((data) => {
  //     //   const dataIsCurrentDate = moment(data.date_time, 'DD/MM/YYYY').format(
  //     //         'YYYY-MM-DD')

  //     //         if(dataIsCurrentDate )

  //     //   return this.prisma.appoitment.updateMany({data: {status: 'canceled'}, where: {date_time: {contains: getTodayDate }}})
  //     // })

  //     // console.log('get data ------>', getTodayDate)
  //     this.logger.debug(
  //       // `et data -> ${getTodayDate}`,
  //       'initestt --->',
  //       // moment().endOf('day').toDate(),
  //       // {
  //       //   appoitment: reservedAppoitmentList.map((data) => ({
  //       //     ...data,
  //           // date_time: moment(data.date_time, 'DD/MM/YYYY').format(
  //           //   'YYYY-MM-DD',
  //           // ),
  //       //   })),
  //       // },
  //     );
  //   } catch (error) {
  //     //  console.log('get data ------>', getTodayDate)
  //     this.logger.debug(`err scheduler -> ${error}`);
  //   }
  // }
  // @Cron('* * * * * *')
  // appoitmentScheduler() {
  //   console.log('test iiiiii woii');
  //   this.logger.debug('Called when the current second is 5');
  // }
}
