import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { RequestCreateDoctorDto } from './dto/request-create-doctor.dto';
import { Response } from 'express';
import { WebResponseDto } from 'src/common-dto/web-response.dto';
import { WebFilterDto } from 'src/common-dto/web-filter.dto';
import { ResponseDoctorDto } from './dto/response-doctor.dto';
import { RequestUpdateDoctorDto } from './dto/request-update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
  ) { }
  async create(
    createDoctorDto: RequestCreateDoctorDto,
    authorization: string,
    file: any,
  ): Promise<WebResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { email: createDoctorDto.email },
    });

    if (user && user.email === createDoctorDto.email) {
      throw new BadRequestException(
        'Unique constraint failed on the fields email',
      );
    } else {
      const generateImgName = `${this.helpers.generateRndm(createDoctorDto.name)}-${Date.now().toString(36).toUpperCase()}-${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getTime()}`;

      const formData = new FormData();
      formData.append('file', new Blob([file.buffer], { type: file.mimetype }));
      formData.append('fileName', generateImgName);
      formData.append('token', authorization.replace('Bearer ', ''));
      formData.append('folder', '/medika_connect/doctor');
      formData.append(
        'transformation',
        JSON.stringify({ pre: 'width:auto,height:auto,quality:50' }),
      );
      formData.append('useUniqueFileName', 'false');

      const uploadImageKit = async (): Promise<globalThis.Response> => {
        const res: globalThis.Response = await fetch(
          'https://upload.imagekit.io/api/v2/files/upload',
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${process.env.IMGKIT_KEY}`,
            },
            body: formData,
          },
        );

        if (!res.ok) {
          throw new InternalServerErrorException();
        }

        return res;
      };

      const result = await (await uploadImageKit()).json();

      if ((await uploadImageKit()).ok) {
        await this.prisma.doctor.create({
          data: {
            ...createDoctorDto,
            img_profile: result.url,
            ext_img_id: result.fileId,
            status: 1,
            password: this.helpers.bcryptEncrypted(createDoctorDto.password),
          },
        });
      }

      return {
        message: 'Success',
      };
    }
  }

  async findAll({ page, limit, search }: WebFilterDto): Promise<ResponseDoctorDto[]> {
    const doctorList = await this.prisma.doctor.findMany({
      omit: { password: true, specialization_id: true },
      include: { specialization: { select: { id: true, name: true } } },
      where: {
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
      },
      ...(limit && page && { skip: limit * (page - 1) }),
      ...(limit && page && { take: limit }),
    });

    return doctorList.map((data) => ({
      id: data.id,
      name: data.name,
      username: data.username,
      code_doctor: data.code_doctor,
      phone_number: data.phone_number,
      address: data.address,
      email: data.email,
      specialization: data.specialization,
      status: data.status,
      ext_img_id: data.ext_img_id,
      img_profile: data.img_profile,
    }));
  }

  async update(
    id: number,
    updateDoctorDto: RequestUpdateDoctorDto,
    authorization: string,
    file: any,
  ): Promise<WebResponseDto> {
    const user = updateDoctorDto?.email
      ? await this.prisma.users.findUnique({
        where: { email: updateDoctorDto.email },
      })
      : null;

    if (user && user.email === updateDoctorDto.email) {
      throw new BadRequestException(
        'Unique constraint failed on the fields email',
      );
    } else {
      const doctorData = await this.prisma.doctor.findUnique({
        where: { id },
      });

      if (file) {
        const generatename = `${this.helpers.generateRndm(updateDoctorDto.name ?? doctorData?.name)}-${Date.now().toString(36).toUpperCase()}-${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getTime()}`;

        const formData = new FormData();
        formData.append(
          'file',
          new Blob([file.buffer], { type: file.mimetype }),
        );
        formData.append('fileName', generatename);
        formData.append('token', authorization.replace('Bearer ', ''));
        formData.append('folder', '/medika_connect/doctor');
        formData.append(
          'transformation',
          JSON.stringify({ pre: 'width:auto,height:auto,quality:50' }),
        );
        formData.append('useUniqueFileName', 'false');

        const uploadImageKit = async (): Promise<globalThis.Response> => {
          const res: globalThis.Response = await fetch(
            'https://upload.imagekit.io/api/v2/files/upload',
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${process.env.IMGKIT_KEY}`,
              },
              body: formData,
            },
          );

          if (!res.ok) {
            throw new InternalServerErrorException();
          }

          return res;
        };

        const deleteImageKit = async (): Promise<globalThis.Response> => {
          const res = await fetch(
            `https://api.imagekit.io/v1/files/${doctorData?.ext_img_id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Basic ${process.env.IMGKIT_KEY}`,
              },
            },
          );

          if (!res.ok || !(await uploadImageKit()).ok) {
            throw new InternalServerErrorException();
          }

          return res;
        };

        if ((await deleteImageKit()).status === 204) {
          const result = await (await uploadImageKit()).json();

          await this.prisma.doctor.update({
            data: {
              ...updateDoctorDto,
              img_profile: result.url,
              ext_img_id: result.fileId,
              ...(updateDoctorDto.password && {
                password: this.helpers.bcryptEncrypted(
                  updateDoctorDto.password,
                ),
              }),
            },
            where: { id },
          });
        }
      } else {
        await this.prisma.doctor.update({
          data: {
            ...updateDoctorDto,
            ...(updateDoctorDto.password && {
              password: this.helpers.bcryptEncrypted(updateDoctorDto.password),
            }),
          },
          where: { id },
        });
      }

      return {
        message: 'Success',
      };
    }
  }
}
