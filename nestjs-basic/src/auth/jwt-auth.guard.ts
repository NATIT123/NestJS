import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';
import { Request } from 'express';
import { Permission } from 'src/permissions/schemas/permission.schema';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('Token is not valid');
    }

    ///Check permissions
    const targetMethod = request.method;
    const targetEndPoint = request.route?.path as string;

    const permisisons = user?.permissions ?? [];

    let isExist = permisisons.find(
      (permission: Permission) =>
        permission.method === targetMethod &&
        permission.apiPath === targetEndPoint,
    );

    if (targetEndPoint.startsWith('/api/v1/auth')) isExist = true;
    if (!isExist) {
      throw new ForbiddenException(
        "You don't have permission to access this route",
      );
    }

    return user;
  }
}
