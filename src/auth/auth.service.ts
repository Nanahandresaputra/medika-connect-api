import { AuthTableDataInterface } from './auth.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ExceptionHandlerService } from 'src/helpers/exception-handler.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { SuccessResponseService } from 'src/helpers/success-response.service';
import { config } from 'src/config/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private helpers: HelpersService,
  ) {}
  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email: loginDto.email },
      });

      const doctor = await this.prisma.doctor.findUnique({
        where: { email: loginDto.email },
      });

      if (
        user &&
        this.helpers.bcryptComapre(loginDto.password, user.password)
      ) {
        const token: string = this.jwtService.sign(
          {
            name: user.name,
            id: user.id,
            email: user.email,
            role: user.role,
          },
          {
            secret: config.key,
          },
        );
        const saveAuthData: AuthTableDataInterface = {
          user_id: user.id,
          doctor_id: null,
          token,
        };
        await this.prisma.auth.create({ data: saveAuthData });
        return new SuccessResponseService().getResponse({ token });
      } else if (
        doctor &&
        this.helpers.bcryptComapre(loginDto.password, doctor.password)
      ) {
        const token: string = this.jwtService.sign(
          {
            name: doctor.name,
            id: doctor.id,
            email: doctor.email,
          },
          {
            secret: config.key,
          },
        );
        const saveAuthData: AuthTableDataInterface = {
          user_id: null,
          doctor_id: doctor.id,
          token,
        };
        await this.prisma.auth.create({ data: saveAuthData });
        return new SuccessResponseService().getResponse({ token });
      } else {
        return new UnauthorizedException(
          'Email or Passwor Invalid!',
        ).getResponse();
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  logout(id: number) {
    return `This action removes a #${id} auth`;
  }
}
