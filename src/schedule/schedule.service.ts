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

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}
  async create(createScheduleDto: CreateScheduleDto) {
    try {
      let initial: TimeDateInterface[] = [];

      const exitingSchedule = await this.prisma.schedule.findMany({
        where: { doctor_id: createScheduleDto.doctor_id, status: 0 },
      });

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

      const filterExiting = initial
        .filter(
          (data) =>
            data.date ===
              exitingSchedule.find((dat) => dat.date === data.date)?.date &&
            data.time ===
              exitingSchedule.find((dat) => dat.time === data.time)?.time,
        )
        .map((data) => ({
          id: exitingSchedule.find(
            (dat) => dat.date === data.date && dat.time === data.time,
          )?.id,
          ...data,
        }));

      if (filterExiting.length > 0) {
        const updateDataExiting = filterExiting.map((data) =>
          this.prisma.schedule.update({
            data: { status: 1 },
            where: { id: data.id, date: data.date, time: data.time as string },
          }),
        );

        await this.prisma.$transaction(updateDataExiting);
      }

      const filterNotExiting = initial.filter(
        (data) =>
          data.date !==
            exitingSchedule.find((dat) => dat.date === data.date)?.date ||
          data.time !==
            exitingSchedule.find((dat) => dat.time === data.time)?.time,
      );

      if (filterNotExiting.length > 0) {
        await this.prisma.schedule.createMany({
          data: initial as [],
        });
      }

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
        select: { time: true, date: true },
      });

      const sendResp: ResponseListScheduleByDoctor[] = doctorData
        .map((doctor) => ({
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          schedule: [...new Set(scheduleData.map((data) => data.date))].map(
            (dateData) => ({
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

  async findOneByDoctor(doctor_id: number) {
    try {
      const doctorData = await this.prisma.doctor.findUnique({
        where: {
          id: doctor_id,
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
          doctor_id,
          status: 1,
        },
        select: { time: true, date: true },
      });

      const sendResp: ResponseListScheduleByDoctor = {
        id: doctorData?.id as number,
        name: doctorData?.name as string,
        specialization: {
          id: doctorData?.specialization.id as number,
          name: doctorData?.specialization.name as string,
        },
        schedule: [...new Set(scheduleData.map((data) => data.date))].map(
          (dateData) => ({
            date: scheduleData.find((data) => data.date === dateData)?.date,
            time: scheduleData
              .filter((timeData) => timeData.date === dateData)
              .map((timeData) => timeData.time),
          }),
        ) as TimeDateInterface[],
      };

      return new SuccessResponseService().getResponse(sendResp);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async update(doctor_id: number, updateScheduleDto: UpdateScheduleDto) {
    try {
      const scheduleDatas = await this.prisma.schedule.findMany({
        where: { doctor_id, date: updateScheduleDto.oldDate },
        select: {
          id: true,
          doctor_id: true,
          date: true,
          time: true,
          status: true,
        },
      });

      const exitingDate = await this.prisma.schedule.findMany({
        where: { doctor_id, date: updateScheduleDto.date },
      });

      if (
        updateScheduleDto.date !== updateScheduleDto.oldDate &&
        exitingDate.filter((data) => data.status === 1).length > 0
      ) {
        return new ExceptionHandlerService().getResponse({
          message: 'date is exsisting!',
        });
      } else {
        const sendData: TimeDateInterface[] = updateScheduleDto.time.map(
          (data) => ({
            date: updateScheduleDto.date as string,
            time: data as string,
          }),
        );

        const matchingData = exitingDate.map((data) => ({
          id: data.id,
          date: data.date,
          dateReq: exitingDate.find((dat) => dat.date === data.date)?.date,
          time: data.time,
          timeReq: exitingDate.find((dat) => dat.time === data.time)?.time,
          status: data.status,
        }));

        if (matchingData.length > 0) {
          const multipleQuery = matchingData.map((datas) =>
            this.prisma.schedule.update({
              data: {
                status: datas.dateReq && datas.timeReq ? 1 : 0,
              },
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
          }))
          .filter(
            (data) =>
              data.date !==
                scheduleDatas.find((dat) => dat.date === data.date)?.date ||
              data.time !==
                scheduleDatas.find((dat) => dat.time === data.time)?.time,
          )
          .filter((data) => data.date === updateScheduleDto.oldDate);

        if (createNewTime.length > 0) {
          await this.prisma.schedule.createMany({ data: createNewTime });
        }

        const existingTimeInDate = await this.prisma.schedule.findMany({
          where: { doctor_id, date: updateScheduleDto.date },
        });

        const newDataByDate = sendData
          .map((data) => ({
            doctor_id,
            date: data.date as string,
            time: data.time as string,
            status: 1,
          }))
          .filter(
            (data) =>
              data.time !==
              existingTimeInDate.find((dat) => dat.time === data.time)?.time,
          );

        if (createNewTime.length === 0) {
          await this.prisma.schedule.createMany({ data: newDataByDate });
        }

        return new SuccessResponseService().getResponse();
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
