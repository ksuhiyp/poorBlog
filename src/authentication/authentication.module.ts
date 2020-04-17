import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: config => ({
        secret: config.get('SECRET'),
        signOptions: { expiresIn: '1w' },
      }),
    }),
    UserModule,
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],

  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
