import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserLoginDTO } from 'src/user/dto/user.dto';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  transform(user: UserLoginDTO, metadata: ArgumentMetadata) {
    const plainPassword = user.password;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plainPassword, salt);
    user.password = hash;
    return user;
  }
}
