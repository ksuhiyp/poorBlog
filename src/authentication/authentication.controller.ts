import { Controller, Post, UseGuards, Request, Req, HttpStatus, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { UserParam } from '../common/decorators/user.decorator';
import { UserEntity } from '../entities/user.entity';
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
      signed: true,
    });
    return req.user;
  }

  @Get('/session')
  @UseGuards(AuthGuard('jwt'))
  async getSession(@Req() req: any, @UserParam() user: UserEntity) {
    return (req.res.statusCode = HttpStatus.NO_CONTENT);
  }
}
