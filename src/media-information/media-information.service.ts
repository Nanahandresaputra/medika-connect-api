import { Injectable } from '@nestjs/common';
import { CreateMediaInformationDto } from './dto/create-media-information.dto';
import { UpdateMediaInformationDto } from './dto/update-media-information.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { config } from 'src/config/config';

@Injectable()
export class MediaInformationService {
  constructor(private prisma: PrismaService) {}
  async create(authorization: string, file: any) {
    try {
      const countImg = await this.prisma.mediaInformation.count();

      // const extensionFile = file.originalname.split('.')[1];
      const generatename = `MEDIA-${countImg + 1}-${Date.now().toString(36).toUpperCase()}-${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getTime()}`;

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

  findOne(id: number) {
    return `This action returns a #${id} mediaInformation`;
  }

  update(id: number, updateMediaInformationDto: UpdateMediaInformationDto) {
    return `This action updates a #${id} mediaInformation`;
  }

  remove(id: number) {
    return `This action removes a #${id} mediaInformation`;
  }
}
