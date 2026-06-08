import { AuthTableDataInterface } from './types/auth.interface';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-connect/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HelpersService } from 'src/helpers/helpers.service';
import { config } from 'src/config/config';
import { RequestLoginDto } from './dto/request-login.dto';
import { RequestRegisterDto } from './dto/request-register.dto';
import { WebResponseDto } from 'src/common-dto/web-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private helpers: HelpersService,
  ) {}
  async login(loginDto: RequestLoginDto, forCustomer: boolean) {
    const user = await this.prisma.users.findUnique({
      where: {
        username: loginDto.username,
        role: forCustomer === true ? 'customer' : 'admin',
      },
    });

    const doctor = await this.prisma.doctor.findUnique({
      where: { username: loginDto.username },
    });

    if (user && this.helpers.bcryptComapre(loginDto.password, user.password)) {
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

      const resp: WebResponseDto = {
        token: token ?? '',
      };
      return resp;
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
      const resp: WebResponseDto = {
        token: token ?? '',
      };
      return resp;
    } else {
      throw new UnauthorizedException('Username or Passwor Invalid!');
    }
  }

  async register(registerDto: RequestRegisterDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { username: registerDto.username },
    });

    if (doctor?.username === registerDto.username) {
      throw new BadRequestException(
        'Unique constraint failed on the fields username',
      );
    }

    await this.prisma.users.create({
      data: {
        ...registerDto,
        password: this.helpers.bcryptEncrypted(registerDto.password),
        status: 1,
        role: 'customer',
      },
    });

    const resp: WebResponseDto = {
      message: 'Success',
    };

    return resp;
  }

  async logout(authorization: string) {
    const token = authorization.replace('Bearer ', '');
    await this.prisma.auth.delete({ where: { token } });
    const resp: WebResponseDto = {
      message: 'Success',
    };

    return resp;
  }
}
