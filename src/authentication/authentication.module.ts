import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthenticationService, LocalStrategy,JwtStrategy],
  imports: [UserModule,
    JwtModule.register({ secret: 'poorblogsecret', signOptions: { expiresIn: '1w' } })],
  controllers: [AuthenticationController]
})
export class AuthenticationModule { 
  
}
