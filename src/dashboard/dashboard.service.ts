import { Injectable } from '@nestjs/common';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { PrismaService } from 'src/prisma-connect/prisma.service';
const moment = require('moment');

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    try {
      const totalDoctorActive = await this.prisma.doctor.count({
        where: { status: 1 },
      });
      const totalPatientActive = await this.prisma.patient.count();
      const totalAppoitment = await this.prisma.appoitment.count();

      const getDateToday = '17-11-2025'; //moment().format('DD-MM-YYYY');

      const doctorTodayAvailable = await this.prisma
        .$queryRaw`select d.name, s.date, sp.name as specialization  from doctor d  join schedule s on d.id = s.doctor_id join specialization sp on d.specialization_id = sp.id where s.date = ${getDateToday} group by d.name, s.date, sp.name `;

      const rawTotalTodayAppoitment = await this.prisma.appoitment.findMany({
        select: {
          id: true,
          patient: { select: { name: true } },
          doctor: { select: { name: true } },
          date_time: true,
        },
        where: { date_time: { contains: getDateToday } },
      });

      const totalTodayAppoitment = rawTotalTodayAppoitment.map((data) => ({
        id: data.id,
        patient: data.patient.name,
        doctor: data.doctor.name,
        date_time: data.date_time,
      }));

      return new SuccessResponseService().getResponse({
        totalDoctorActive,
        totalPatientActive,
        totalAppoitment,
        doctorTodayAvailable,
        totalTodayAppoitment,
      });
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
