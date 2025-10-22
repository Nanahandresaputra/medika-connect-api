import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import {
  ResponseListScheduleByDoctor,
  TimeDateInterface,
} from './interfaces/schedule.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { time } from 'console';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}
  async create(createScheduleDto: CreateScheduleDto) {
    try {
      let initial: any = [];

      createScheduleDto.schedules.forEach((data) => {
        data.time.forEach((dat) => {
          const dataPush = {
            doctor_id: createScheduleDto.doctor_id,
            date: data.date,
            time: dat,
            status: 1,
          };
          initial.push(dataPush);
        });
      });

      await this.prisma.schedule.createMany({ data: initial });

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAll(doctor_id: number, specialization_id: number, date: string) {
    try {
      const doctorData = await this.prisma.doctor.findMany({
        where: {
          ...(doctor_id && { id: doctor_id }),

          ...(specialization_id && { specialization_id }),
          status: 1,
        },
        select: {
          id: true,
          name: true,
          specialization: true,
          status: true,
        },
      });

      const scheduleData = await this.prisma.schedule.findMany({
        where: {
          ...(doctor_id && { doctor_id }),
          ...(date && { date }),
          status: 1,
        },
        select: { id: true, time: true, date: true },
      });

      const sendResp: ResponseListScheduleByDoctor[] = doctorData
        .map((doctor) => ({
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          schedule: [...new Set(scheduleData.map((data) => data.date))].map(
            (dateData) => ({
              id: scheduleData.find((data) => data.date === dateData)?.id,
              date: scheduleData.find((data) => data.date === dateData)?.date,
              time: scheduleData
                .filter((timeData) => timeData.date === dateData)
                .map((timeData) => timeData.time),
            }),
          ),
        }))
        .filter(
          (data) => data.schedule.length > 0,
        ) as ResponseListScheduleByDoctor[];

      return new SuccessResponseService().getResponse(sendResp);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  async update(doctor_id: number, updateScheduleDto: UpdateScheduleDto) {
    try {
      const scheduleDatas = await this.prisma.schedule.findMany({
        where: { doctor_id, date: updateScheduleDto.date },
        select: {
          id: true,
          doctor_id: true,
          date: true,
          time: true,
          status: true,
        },
      });

      const sendData: TimeDateInterface[] = updateScheduleDto.time.map(
        (data) => ({
          date: updateScheduleDto.date as string,
          time: data as string,
        }),
      );

      // const matchingData = sendData.map((data) => ({
      //   id: scheduleDatas.find(
      //     (dt) => dt.date === data.date && dt.time === data.time,
      //   )?.id,
      //   date: scheduleDatas.find(
      //     (dt) => dt.date === data.date && dt.time === data.time,
      //   )?.date,
      //   dateReq: data.date,
      //   time: scheduleDatas.find(
      //     (dt) => dt.date === data.date && dt.time === data.time,
      //   )?.time,
      //   timeReq: data.time,
      //   status: scheduleDatas.find(
      //     (dt) => dt.date === data.date && dt.time === data.time,
      //   )?.status,
      // }));

      const matchingData = scheduleDatas.map((data) => ({
        id: data.id,
        date: data.date,
        dateReq: sendData.find((dat) => dat.date === data.date)?.date,
        time: data.time,
        timeReq: sendData.find((dat) => dat.time === data.time)?.time,
        status: data.status,
      }));

      if (matchingData.length > 0) {
        const multipleQuery = matchingData.map((datas) =>
          this.prisma.schedule.update({
            data: { status: datas.dateReq && datas.timeReq ? 1 : 0 },
            where: { id: datas.id ?? 0 },
          }),
        );
        await this.prisma.$transaction(multipleQuery);
      }

      const createNewTime = sendData
        .map((data) => ({
          doctor_id,
          date: scheduleDatas.find(
            (dt) => dt.date === data.date && dt.time === data.time,
          )?.date
            ? null
            : data.date,
          time: scheduleDatas.find(
            (dt) => dt.date === data.date && dt.time === data.time,
          )?.time
            ? null
            : data.time,
          status: 1,
        }))
        .filter((data) => data.date !== null && data.time !== null)
        .map((data) => ({
          doctor_id,
          date: data.date as string,
          time: data.time as string,
          status: data.status,
        }));

      if (createNewTime.length > 0) {
        await this.prisma.schedule.createMany({ data: createNewTime });
      }

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
