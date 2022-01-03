import { CanActivate, ExecutionContext } from '@nestjs/common';

export class LocalAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    return request.session?.user;
  }
}
export class SuperUserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return false;
  }
}
