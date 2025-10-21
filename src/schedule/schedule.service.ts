import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}
  async create(createScheduleDto: CreateScheduleDto) {
    try {
      const sendData = createScheduleDto.schedules.map((data) => ({
        doctor_id: createScheduleDto.doctor_id,
        date: data.date,
        time: data.time,
      }));

      return new SuccessResponseService().getResponse(sendData);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAllBydoctor(doctor_id: number) {
    try {
      const schedulesByDoctor = await this.prisma.schedule.findMany({
        where: { doctor_id },
        select: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: { select: { id: true, name: true } },
            },
          },
          date: true,
          time: true,
        },
      });

      console.log('schedulee -->', schedulesByDoctor);

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
