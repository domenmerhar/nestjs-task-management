import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UserActivation => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
