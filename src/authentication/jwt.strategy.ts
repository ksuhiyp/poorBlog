import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
const cookieExtractor = req => {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies['jwt'];
  }
  return token;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.id);
    if (!user) {
      return null;
    }
    return { id: payload.id, username: payload.username };
  }
}
