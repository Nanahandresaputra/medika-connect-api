import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { UserInterface } from './types/user.interface';
import { FilterData } from 'src/types/filter-data.type';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const doctor = await this.prisma.doctor.findUnique({
        where: { email: createUserDto.email },
      });
      if (doctor?.email === createUserDto.email) {
        return new ExceptionHandlerService().getResponse({
          message: 'Unique constraint failed on the fields email',
        });
      } else {
        await this.prisma.users.create({
          data: {
            ...createUserDto,
            password: this.helpers.bcryptEncrypted(createUserDto.password),
            role: 'admin',
            status: +1,
          },
        });
        return new SuccessResponseService().getResponse();
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAll({limit, page, search, roleUser}:FilterData) {
    try {
      const users = await this.prisma.users.findMany({
        where: {
          ...(search && {name: {contains: search, mode: 'insensitive'}}),
          ...(roleUser && {role: roleUser}),
        },
         ...(page && limit && {
            skip: limit * (page - 1),
          }),
        ...(page && limit && { take: limit }),
      });

      const respObj: UserInterface[] = users.map((data) => ({
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        status: data.status,
      }));

      return new SuccessResponseService().getResponse(respObj);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const doctor = await this.prisma.doctor.findUnique({
        where: { email: updateUserDto.email },
      });

      if (doctor?.email === updateUserDto.email) {
        return new ExceptionHandlerService().getResponse({
          message: 'Unique constraint failed on the fields email',
        });
      } else {
        await this.prisma.users.update({
          data: {
            ...updateUserDto,
            ...(updateUserDto.password && {
              password: this.helpers.bcryptEncrypted(updateUserDto.password),
            }),
            role: 'admin',
            status: +1,
          },
          where: { id },
        });
        return new SuccessResponseService().getResponse();
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.users.delete({ where: { id } });

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
