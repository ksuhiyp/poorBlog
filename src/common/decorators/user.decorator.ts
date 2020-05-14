import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { plainToClass } from 'class-transformer';

export const UserParam = createParamDecorator((data: unknown, request: any) => {
  return plainToClass(UserEntity, request.user);
});
