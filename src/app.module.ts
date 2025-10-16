import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { SpecializationModule } from './specialization/specialization.module';
import { AuthModule } from './auth/auth.module';
import { HelpersService } from './helpers/helpers.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    DoctorModule,
    SpecializationModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  controllers: [],
  providers: [HelpersService],
})
export class AppModule {}
