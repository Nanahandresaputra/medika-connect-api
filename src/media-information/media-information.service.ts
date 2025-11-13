import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';

@Injectable()
export class MediaInformationService {
  constructor(private prisma: PrismaService) {}
  async create(authorization: string, file: any) {
    try {
      // const extensionFile = file.originalname.split('.')[1];
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

        return new SuccessResponseService().getResponse();
      } else {
        return new ExceptionHandlerService().getResponse();
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async findAll() {
    try {
      const mediaData = await this.prisma.mediaInformation.findMany();
      return new SuccessResponseService().getResponse(mediaData);
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async update(id: number, authorization: string, file: any) {
    try {
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
          `https://api.imagekit.io/v1/files/${mediaData?.ext_img_id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Basic ${process.env.IMGKIT_KEY}`,
            },
          },
        );
        if (deleteImageKit.status === 204) {
          const result = await uploadImageKit.json();
          await this.prisma.mediaInformation.update({
            where: { id },
            data: { ext_img_id: result.fileId, img_url: result.url },
          });

          return new SuccessResponseService().getResponse();
        } else {
          return new ExceptionHandlerService().getResponse();
        }
      } else {
        return new ExceptionHandlerService().getResponse();
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse();
    }
  }

  async remove(id: number) {
    try {
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
        return new SuccessResponseService().getResponse();
      } else {
        return new ExceptionHandlerService().getResponse();
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
