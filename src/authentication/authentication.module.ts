import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthorModule } from 'src/author/author.module';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthenticationService, LocalStrategy,JwtStrategy],
  imports: [AuthorModule, AuthenticationModule,
    JwtModule.register({ secret: 'poorblogsecret', signOptions: { expiresIn: '1w' } })],
  controllers: [AuthenticationController]
})
export class AuthenticationModule { 
  
}
