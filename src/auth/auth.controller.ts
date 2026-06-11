import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Header,
  Headers,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RequestLoginDto } from './dto/request-login.dto';
import { RequestRegisterDto } from './dto/request-register.dto';
import { WebResponseDto } from 'src/common-dto/web-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() loginDto: RequestLoginDto,
    @Query('forCustomer') forCustomer: boolean,
  ): Promise<WebResponseDto> {
    return this.authService.login(loginDto, forCustomer);
  }
  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Body() registerDto: RequestRegisterDto): Promise<WebResponseDto> {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  logout(@Headers('Authorization') authorization: string): Promise<WebResponseDto> {
    return this.authService.logout(authorization);
  }
}
