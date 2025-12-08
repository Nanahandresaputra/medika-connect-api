import { Injectable } from '@nestjs/common';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { PrismaService } from 'src/prisma-connect/prisma.service';
const moment = require('moment');

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
  ) {}
  async findAll() {
    try {
      const totalDoctorActive = await this.prisma.doctor.count({
        where: { status: 1 },
      });
      const totalPatientActive = await this.prisma.patient.count();
      const getDateToday = moment().format('YYYY-MM-DD');

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

      const todayAppoitment = {
        date: getDateToday,
        listPatients: rawTotalTodayAppoitment.map((data) => ({
          id: data.id,
          patient: data.patient.name,
          doctor: data.doctor.name,
          date_time: data.date_time,
        })),
      };

      const totalAppoitmentToday = todayAppoitment.listPatients.length; //await this.prisma.appoitment.count();

      const topThreeDepartement: [] = await this.prisma
        .$queryRaw`select s.name as departement, COUNT(*) as total from appoitment 
        a join doctor d on a.doctor_id  = d.id join specialization s on d.specialization_id = s.id where a.date_time like ${'%' + getDateToday + '%'} group by s.name  order by total desc  limit 3`;

      // const appoitmentStatistic = async () => {
      //   const appoitmentStatisticQuery: [] = await this.prisma
      //     .$queryRaw`select to_char(date, 'YYYY-MM-DD') as date, departement, total from (select cast(a.date_time as date) as date, s.name as departement,  COUNT(*) as total  from appoitment a join doctor d on a.doctor_id = d.id
      //   join specialization s on d.specialization_id = s.id group by s.name, date) as sub where date >= now() - interval '1 week' order by date desc`;

      //   const appoitmentList: any[] = appoitmentStatisticQuery.map(
      //     (data: any) => ({
      //       ...data,
      //       total: this.helpers.bigIntToString(data.total),
      //     }),
      //   );

      //   const dayName: string[] = [
      //     'Sunday',
      //     'Monday',
      //     'Thuesday',
      //     'Wednesday',
      //     'Thursday',
      //     'Friday',
      //     'Saturday',
      //   ];

      //   const appoitmentDate = (startDate = moment()): string[] => {
      //     const weekDates: any = [];
      //     let currentDay = moment(startDate).startOf('week'); // .startOf('week') <- sun - sat

      //     for (let i = 0; i < 7; i++) {
      //       weekDates.push(moment(currentDay).format('YYYY-MM-DD'));
      //       currentDay.add(1, 'day');
      //     }
      //     return weekDates;
      //   };

      //   const results = appoitmentDate().map((data, index) => ({
      //     date: data,
      //     day: dayName[index],
      //     appoitments: appoitmentList
      //       .filter((dat) => dat?.date === data)
      //       .map((dat) => ({ departement: dat.departement, total: dat.total })),
      //   }));

      //   return results;
      // };
      const appoitmentStatistic = async () => {
        const appoitmentStatisticQuery: [] = await this.prisma
          .$queryRaw`select to_char(date, 'YYYY-MM-DD') as date, status, total from (select cast(a.date_time as date) as date, a.status,
COUNT(*) as total  from appoitment a join doctor d on a.doctor_id = d.id group by a.status, date) 
as sub where date >= now() - interval '1 week' order by "date" asc`;

        const statusList = ['canceled', 'reserved', 'completed'];

        const appoitmentList: any[] = appoitmentStatisticQuery.map(
          (data: any) => ({
            ...data,
            total: this.helpers.bigIntToString(data.total),
          }),
        );

        const dayName: string[] = [
          'Sunday',
          'Monday',
          'Thuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];

        const appoitmentDate = (startDate = moment()): string[] => {
          const weekDates: any = [];
          let currentDay = moment(startDate).startOf('week'); // .startOf('week') <- sun - sat

          for (let i = 0; i < 7; i++) {
            weekDates.push(moment(currentDay).format('YYYY-MM-DD'));
            currentDay.add(1, 'day');
          }
          return weekDates;
        };

        const results = appoitmentDate().map((data, index) => ({
          date: data,
          day: dayName[index],
          appoitmentStatus: {
            [statusList[0]]:
              appoitmentList.find(
                (dat) => dat?.date === data && dat?.status === statusList[0],
              )?.total ?? 0,
            [statusList[1]]:
              appoitmentList.find(
                (dat) => dat?.date === data && dat?.status === statusList[1],
              )?.total ?? 0,
            [statusList[2]]:
              appoitmentList.find(
                (dat) => dat?.date === data && dat?.status === statusList[2],
              )?.total ?? 0,
          },
          // statusList.map((statusData) => ({
          //   status: statusData,
          //   total:
          // appoitmentList.find(
          //   (dat) => dat?.date === data && dat?.status === statusData,
          // )?.total ?? 0,
          // })),
          //  appoitmentList
          //   .filter((dat) => dat?.date === data)
          //   .map((dat) => ({ status: dat.status, total: dat.total })),
        }));

        return results;
      };

      return new SuccessResponseService().getResponse({
        totalDoctorActive,
        totalPatientActive,
        totalAppoitmentToday,
        doctorTodayAvailable,
        todayAppoitment,
        topThreeDepartement: topThreeDepartement.map((data: any) => ({
          ...data,
          total: this.helpers.bigIntToString(data.total),
        })),
        apoitmentStatistic: await appoitmentStatistic(),
      });
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
