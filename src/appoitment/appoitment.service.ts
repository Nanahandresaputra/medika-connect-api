import { Injectable } from '@nestjs/common';
import { CreateAppoitmentDto } from './dto/create-appoitment.dto';
import { UpdateAppoitmentDto } from './dto/update-appoitment.dto';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma-connect/prisma.service';

@Injectable()
export class AppoitmentService {
  constructor(helpers: HelpersService, prisma: PrismaService) {}
  async create(createAppoitmentDto: CreateAppoitmentDto) {
    try {
    } catch (error) {}
  }

  findAll() {
    return `This action returns all appoitment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appoitment`;
  }

  update(id: number, updateAppoitmentDto: UpdateAppoitmentDto) {
    return `This action updates a #${id} appoitment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appoitment`;
  }
}
