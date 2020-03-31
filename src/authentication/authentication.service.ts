import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from 'src/models/user.model';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (user.length && this.validatePassowrd(password, user[0].password)) {
      delete user[0].password;
      return user;
    }
    return null;
  }

  private validatePassowrd(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  login(user: UserLoginDTO) {
    const payload = { username: user.username, sub: user.password };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
