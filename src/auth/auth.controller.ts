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
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto, @Query('forCustomer') forCustomer:boolean) {
    return this.authService.login(loginDto, forCustomer);
  }
  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  logout(@Headers('Authorization') authorization: string) {
    return this.authService.logout(authorization);
  }
}
