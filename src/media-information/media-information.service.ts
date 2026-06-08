import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { WebResponseDto } from 'src/common-dto/web-response.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ResponseMediaDto } from './dto/response-media.dto';

@Injectable()
export class MediaInformationService {
  constructor(private prisma: PrismaService) {}
  async create(authorization: string, file: any) {
    const generatename = `MEDIA-${Date.now().toString(36).toUpperCase()}-${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getTime()}`;

    const formData = new FormData();
    formData.append('file', new Blob([file.buffer], { type: file.mimetype }));
    formData.append('fileName', generatename);
    formData.append('token', authorization.replace('Bearer ', ''));
    formData.append('folder', '/medika_connect/media_information');
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

      await this.prisma.mediaInformation.create({
        data: { ext_img_id: result.fileId, img_url: result.url },
      });

      const resp: WebResponseDto = {
        message: 'Success',
      };

      return resp;
    }
  }

  async findAll() {
    const mediaData = await this.prisma.mediaInformation.findMany();

    const resp: ResponseMediaDto = {
      data: mediaData,
    };
    return resp;
  }

  async update(id: number, authorization: string, file: any) {
    const mediaData = await this.prisma.mediaInformation.findUnique({
      where: { id },
    });

    const generatename = `MEDIA-${Date.now().toString(36).toUpperCase()}-${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getTime()}`;

    const formData = new FormData();
    formData.append('file', new Blob([file.buffer], { type: file.mimetype }));
    formData.append('fileName', generatename);
    formData.append('token', authorization.replace('Bearer ', ''));
    formData.append('folder', '/medika_connect/media_information');
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
      const res: globalThis.Response = await fetch(
        `https://api.imagekit.io/v1/files/${mediaData?.ext_img_id}`,
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

    const resp: WebResponseDto = {
      message: 'Success',
    };

    if ((await deleteImageKit()).status === 204) {
      const result = await (await uploadImageKit()).json();
      await this.prisma.mediaInformation.update({
        where: { id },
        data: { ext_img_id: result.fileId, img_url: result.url },
      });

      return resp;
    }

    throw new InternalServerErrorException();
  }

  async remove(id: number) {
    const mediaData = await this.prisma.mediaInformation.findUnique({
      where: { id },
    });

    const deleteImageKit = await fetch(
      `https://api.imagekit.io/v1/files/${mediaData?.ext_img_id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${process.env.IMGKIT_KEY}`,
        },
      },
    );

    if (deleteImageKit.status === 204) {
      await this.prisma.mediaInformation.delete({ where: { id } });
      const resp: WebResponseDto = {
        message: 'Success',
      };

      return resp;
    }

    throw new InternalServerErrorException();
  }
}
