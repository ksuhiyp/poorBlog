import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  UsePipes,
  ValidationPipe,
  Header,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req: any) {
    req.res.cookie('jwt', this.authenticationService.login(req.user), {
      maxAge: +process.env.COOKIE_MAX_AGE,
      sameSite: 'strict',
      secure: false,
      httpOnly: true,
    });
    return;
  }
}
