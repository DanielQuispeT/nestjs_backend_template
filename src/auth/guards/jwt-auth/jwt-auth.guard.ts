import { AuthenticationError } from '@nestjs/apollo';
import {
  ContextType,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { IS_PUBLIC_KEY } from 'src/common/decorators/key-decorators.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.getIsPublic(context)) {
      try {
        return super.canActivate(context);
      } catch (error) {
        return true; //El error lo asumimos que es una ruta pública
      }
    }
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }
    return context.switchToHttp().getRequest();
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ) {
    try {
      if (this.getIsPublic(context) && (!user || err)) {
        return {};
      }

      const request = this.getRequest(context);
      const authHeader = request.headers.authorization;

      if (!authHeader) throw new UnauthorizedException('Token no enviado');

      const token = authHeader.split(' ')[1];

      if (!token) throw new UnauthorizedException('Token no enviado');

      try {
        this.authService.verifyAccess(token);
      } catch (err) {
        if (err instanceof TokenExpiredError)
          throw new UnauthorizedException('Token expirado');
        else throw new UnauthorizedException('Token no válido');
      }

      if (err || !user) {
        throw (
          err || new AuthenticationError('No se pudo autenticar con el token')
        );
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  getIsPublic(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic;
  }
}
