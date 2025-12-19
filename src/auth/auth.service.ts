import { AuthTableDataInterface } from './types/auth.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
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
  async login(loginDto: LoginDto, forCustomer:boolean) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { username: loginDto.username, role: forCustomer === true ? 'customer' : 'admin' },
      });


      const doctor = await this.prisma.doctor.findUnique({
        where: { username: loginDto.username },
      });

      if (
        user && 
        this.helpers.bcryptComapre(loginDto.password, user.password)
      ) {
        const token: string = this.jwtService.sign(
          {
            name: user.name,
            id: user.id,
            username: user.username,
            role: user.role,
          },
          {
            secret: config.key,
            header: {
              alg: 'HS256',
              kid: config.publicKey,
            },
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
            username: doctor.username,
            role: doctor.role,
          },
          {
            secret: config.key,
            header: {
              alg: 'HS256',
              kid: config.publicKey,
            },
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
          'Username or Passwor Invalid!',
        ).getResponse();
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const doctor = await this.prisma.doctor.findUnique({
        where: { username: registerDto.username },
      });

      if (doctor?.username === registerDto.username) {
        return new ExceptionHandlerService().getResponse({
          message: 'Unique constraint failed on the fields username',
        });
      } else {
        await this.prisma.users.create({
          data: {
            ...registerDto,
            password: this.helpers.bcryptEncrypted(registerDto.password),
            status: 1,
            role: 'customer',
          },
        });

        return new SuccessResponseService().getResponse();
      }
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }

  async logout(authorization: string) {
    try {
      const token = authorization.replace('Bearer ', '');
      await this.prisma.auth.delete({ where: { token } });
      return new SuccessResponseService().getResponse();
    } catch (error) {
      return new ExceptionHandlerService().getResponse(error);
    }
  }
}
