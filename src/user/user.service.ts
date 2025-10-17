import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ResponseListUserObj } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      await this.prisma.users.create({
        data: {
          ...createUserDto,
          password: this.helpers.bcryptEncrypted(createUserDto.password),
          role: 'admin',
          status: +1,
        },
      });

      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.users.findMany();

      const respObj: ResponseListUserObj[] = users.map((data) => ({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
      }));

      return new SuccessResponseService().getResponse(respObj);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
