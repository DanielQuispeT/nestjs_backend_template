import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const response = context.switchToHttp().getResponse();
    if (err || !user) {
      response.redirect(`${process.env.FRONTEND_URL_CLIENT}/auth/error-close`);
    }
    return user;
  }
}
