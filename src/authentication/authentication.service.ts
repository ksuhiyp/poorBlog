import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  UserLoginDTO,
  UserResponseDTO,
  Credentials,
} from 'src/models/user.model';
import { UserEntity } from 'src/entities/user.entity';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (user && this.validatePassowrd(password, user.password)) {
      delete user.password;
      return user;
    }
    return null;
  }

  private validatePassowrd(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  login(user: Partial<UserEntity>) {
    const payload = { username: user.username, id: user.id };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
