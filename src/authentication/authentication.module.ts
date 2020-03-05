import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthorModule } from 'src/author/author.module';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [AuthenticationService, LocalStrategy],
  imports: [AuthorModule, AuthenticationModule],
  controllers: [AuthenticationController]
})
export class AuthenticationModule { }
