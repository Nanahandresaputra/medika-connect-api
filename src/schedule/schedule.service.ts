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
        console.log('trigger exiting ---->', filterExiting);
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
        console.log('trigger not exiting ---->', filterNotExiting);
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
        select: { time: true, date: true, doctor_id: true },
      });

      const sendResp: ResponseListScheduleByDoctor[] = doctorData
        .map((doctor) => ({
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          schedule_doctor_id: scheduleData.find(
            (data) => data.doctor_id === doctor.id,
          )?.doctor_id,
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
          (data) => data.schedule_doctor_id === data.id,
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
      const datagTime = await this.prisma.schedule.findMany({
        where: { doctor_id, date: updateScheduleDto.date },
      });
      const newTime = updateScheduleDto.time.map((data) => ({
        doctor_id,
        date: updateScheduleDto.date,
        time: data,
      }));

      const notExitingNewTime = newTime
        .filter(
          (data) =>
            datagTime.find((dt) => dt.time === data.time)?.time !== data.time,
        )
        .map((data) => ({
          doctor_id,
          date: updateScheduleDto.date,
          time: data.time,
          status: 1,
        }));

      if (updateScheduleDto.date === updateScheduleDto.oldDate) {
        const exitingNewTime = newTime
          .filter(
            (data) =>
              datagTime.find((dt) => dt.time === data.time)?.time === data.time,
          )
          .map((data) => ({
            doctor_id,
            date: updateScheduleDto.date,
            time: data,
            status: 1,
          }));

        if (notExitingNewTime.length > 0) {
          console.log('trigger not exiting <<<<');
          await this.prisma.schedule.createMany({
            data: notExitingNewTime,
          });
        }

        if (exitingNewTime.length > 0) {
          console.log('trigger exiting <<<<');
          const updateTime = datagTime.map((data) => {
            return this.prisma.schedule.update({
              where: { id: data.id },
              data: {
                status:
                  newTime.find((dt) => dt.time === data.time)?.time !==
                    undefined || data.status === 0
                    ? 1
                    : 0,
              },
            });
          });

          await this.prisma.$transaction(updateTime);
        }
      } else {
        const isTimeSame = newTime
          .map((data) => datagTime.map((dt) => dt.time).includes(data.time))
          .filter((data) => data === true);

        const sendDataCreate = updateScheduleDto.time.map((data) => ({
          doctor_id,
          date: updateScheduleDto.date,
          time: data,
          status: 1,
        }));
        if (datagTime.length === isTimeSame.length) {
          await this.prisma.schedule.createMany({ data: sendDataCreate });
        } else {
          await this.prisma.schedule.createMany({ data: sendDataCreate });
        }
      }

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
