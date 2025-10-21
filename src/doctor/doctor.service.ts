import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { ResponseListDoctorObj } from './doctor.inerface';

@Injectable()
export class DoctorService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
  ) {}
  async create(createDoctorDto: CreateDoctorDto) {
    try {
      await this.prisma.doctor.create({
        data: {
          ...createDoctorDto,
          status: 1,
          password: this.helpers.bcryptEncrypted(createDoctorDto.password),
        },
      });

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAll() {
    try {
      const doctorList = await this.prisma.doctor.findMany();

      const doctorResp: ResponseListDoctorObj[] = doctorList.map((data) => ({
        id: data.id,
        name: data.name,
        username: data.username,
        code_doctor: data.code_doctor,
        phone_number: data.phone_number,
        address: data.address,
        email: data.email,
        specialization_id: data.specialization_id,
        status: data.status,
      }));

      return new SuccessResponseService().getResponse(doctorResp);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    try {
      await this.prisma.doctor.update({
        data: {
          ...updateDoctorDto,
          ...(updateDoctorDto.password && {
            password: this.helpers.bcryptEncrypted(updateDoctorDto.password),
          }),
        },
        where: { id },
      });
      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.doctor.delete({ where: { id } });

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
