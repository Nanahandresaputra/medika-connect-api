import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { SpecializationModule } from './specialization/specialization.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaConnectModule } from './prisma-connect/prisma-connect.module';
import { HelpersModule } from './helpers/helpers.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from './config/config';
import { ScheduleModule } from './schedule/schedule.module';
import { PatientModule } from './patient/patient.module';
import { AppoitmentModule } from './appoitment/appoitment.module';
import { MediaInformationModule } from './media-information/media-information.module';

@Module({
  imports: [
    UserModule,
    DoctorModule,
    SpecializationModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      // signOptions: { expiresIn: '60s' },
    }),
    PrismaConnectModule,
    HelpersModule,
    ScheduleModule,
    PatientModule,
    AppoitmentModule,
    MediaInformationModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
