import { BadRequestException, Injectable } from '@nestjs/common';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { RequestCreateUserDto } from './dto/request-create-user.dto';
import { WebResponseDto } from 'src/common-dto/web-response.dto';
import { roleUser, WebFilterDto } from 'src/common-dto/web-filter.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { RequestUpdateUserDto } from './dto/request-update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
  ) { }
  async create(createUserDto: RequestCreateUserDto): Promise<WebResponseDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { email: createUserDto.email },
    });
    if (doctor?.email === createUserDto.email) {
      throw new BadRequestException(
        'Unique constraint failed on the fields email',
      );
    } else {
      await this.prisma.users.create({
        data: {
          ...createUserDto,
          password: this.helpers.bcryptEncrypted(createUserDto.password),
          role: 'admin',
          status: +1,
        },
      });

      return {
        message: 'Success',
      }
    }
  }

  async findAll({ limit, page, search, roleUser }: WebFilterDto): Promise<ResponseUserDto[]> {
    const users = await this.prisma.users.findMany({
      where: {
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
        ...(roleUser && { role: roleUser }),
      },
      ...(page &&
        limit && {
        skip: limit * (page - 1),
      }),
      ...(page && limit && { take: limit }),
    });

    return users.map((data) => ({
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      role: data.role as roleUser,
      status: data.status,
    }));
  }

  async update(id: number, updateUserDto: RequestUpdateUserDto): Promise<WebResponseDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { email: updateUserDto.email },
    });

    if (doctor?.email === updateUserDto.email) {
      throw new BadRequestException(
        'Unique constraint failed on the fields email',
      );
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
      return {
        message: 'Success',
      }
    }
  }

  async remove(id: number): Promise<WebResponseDto> {
    await this.prisma.users.delete({ where: { id } });

    return {
      message: 'Success',
    }
  }
}
