import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { DoctorInterface } from './types/doctor.inerface';
import { FilterData } from 'src/types/filter-data.type';

@Injectable()
export class DoctorService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
  ) {}
  async create(
    createDoctorDto: CreateDoctorDto,
    authorization: string,
    file: any,
  ) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email: createDoctorDto.email },
      });

      if (user && user.email === createDoctorDto.email) {
        return new ExceptionHandlerService().getResponse({
          message: 'Unique constraint failed on the fields email',
        });
      } else {
        const generateImgName = `${this.helpers.generateRndm(createDoctorDto.name)}-${Date.now().toString(36).toUpperCase()}-${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getTime()}`;

        const formData = new FormData();
        formData.append(
          'file',
          new Blob([file.buffer], { type: file.mimetype }),
        );
        formData.append('fileName', generateImgName);
        formData.append('token', authorization.replace('Bearer ', ''));
        formData.append('folder', '/medika_connect/doctor');
        formData.append(
          'transformation',
          JSON.stringify({ pre: 'width:auto,height:auto,quality:50' }),
        );
        formData.append('useUniqueFileName', 'false');

        const uploadImageKit = await fetch(
          'https://upload.imagekit.io/api/v2/files/upload',
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${process.env.IMGKIT_KEY}`,
            },
            body: formData,
          },
        );

        if (uploadImageKit.ok) {
          const result = await uploadImageKit.json();
          await this.prisma.doctor.create({
            data: {
              ...createDoctorDto,
              img_profile: result.url,
              ext_img_id: result.fileId,
              status: 1,
              password: this.helpers.bcryptEncrypted(createDoctorDto.password),
            },
          });
          return new SuccessResponseService().getResponse();
        } else {
          const result = await uploadImageKit.json();
          console.log('upload img -->', result);
          return new ExceptionHandlerService().getResponse();
        }
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAll({page, limit, search}:FilterData) {
    try {
      const doctorList = await this.prisma.doctor.findMany({
        omit: {password: true, specialization_id: true},
        include: {specialization: {select:{id:true, name: true}}},
        where: {
          ...(search && {name: {contains: search, mode: 'insensitive'}}),
        },
        ...(limit && page) && {skip: limit * (page - 1)},
        ...(limit && page) && {take: limit},
        
      });

      const doctorResp: DoctorInterface[] = doctorList.map((data) => ({
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
        img_profile:data.img_profile
      }));

      return new SuccessResponseService().getResponse(doctorResp);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async update(
    id: number,
    updateDoctorDto: UpdateDoctorDto,
    authorization: string,
    file: any,
  ) {
    try {
      const user = updateDoctorDto?.email
        ? await this.prisma.users.findUnique({
            where: { email: updateDoctorDto.email },
          })
        : null;

      if (user && user.email === updateDoctorDto.email) {
        return new ExceptionHandlerService().getResponse({
          message: 'Unique constraint failed on the fields email',
        });
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

          const uploadImageKit = await fetch(
            'https://upload.imagekit.io/api/v2/files/upload',
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${process.env.IMGKIT_KEY}`,
              },
              body: formData,
            },
          );

          if (uploadImageKit.ok) {
            const deleteImageKit = await fetch(
              `https://api.imagekit.io/v1/files/${doctorData?.ext_img_id}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Basic ${process.env.IMGKIT_KEY}`,
                },
              },
            );

            if (deleteImageKit.status === 204) {
              const result = await uploadImageKit.json();

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
              return new SuccessResponseService().getResponse();
            } else {
              return new ExceptionHandlerService().getResponse();
            }
          } else {
            return new ExceptionHandlerService().getResponse();
          }
        } else {
          await this.prisma.doctor.update({
            data: {
              ...updateDoctorDto,
              ...(updateDoctorDto.password && {
                password: this.helpers.bcryptEncrypted(
                  updateDoctorDto.password,
                ),
              }),
            },
            where: { id },
          });
          return new SuccessResponseService().getResponse();
        }
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
