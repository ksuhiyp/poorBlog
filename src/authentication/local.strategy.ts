import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthenticationService } from './authentication.service';
import { PassportStrategy } from '@nestjs/passport';
import { isString } from 'util';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super();
  }

  async validate(username: string, password: string) {
    if (typeof username != 'string' || typeof password != 'string') {
      throw new UnauthorizedException();
    }
    const user = await this.authenticationService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
