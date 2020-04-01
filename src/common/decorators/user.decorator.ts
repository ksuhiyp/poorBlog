import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserParam = createParamDecorator(
  (data: unknown, request: any) => {

    return request.user;
  },
);