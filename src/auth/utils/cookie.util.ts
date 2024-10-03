import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { CookieOptions } from 'express';

export const tipo_cookie = [
  {
    tipo_user: 'user',
    name_cookie: 'refreshToken',
  },
  {
    tipo_user: 'admin',
    name_cookie: 'refreshTokenAdmin',
  },
];

export function clearRefreshTokenCookie(
  res: Response,
  domain: string,
  isUser: boolean,
) {
  const name_cookie = isUser
    ? tipo_cookie[0].name_cookie
    : tipo_cookie[1].name_cookie;
  res.clearCookie(name_cookie, {
    domain,
    path: '/',
  });
  res.status(HttpStatus.OK).send({
    message: 'Sesión cerrada',
  });
}

export function setRefreshTokenCookie(
  res: Response,
  refreshToken: string,
  accessToken: string,
  permissions: string[],
  domain: string,
  isUser: boolean,
) {
  const name_cookie = isUser
    ? tipo_cookie[0].name_cookie
    : tipo_cookie[1].name_cookie;
  res.cookie(name_cookie, refreshToken, options(domain));
  res.status(HttpStatus.OK).send({ accessToken, permissions });
}

export function options(domain: string): CookieOptions {
  return {
    httpOnly: true,
    domain,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: getMaxAge(),
    path: '/',
  };
}

export function getMaxAge(): number {
  const DEFAULT_REFRESH_TIME = 3600000; // 1 hour in milliseconds
  const time = process.env.JWT_EXPIRES_IN_REFRESH;
  if (!time) return DEFAULT_REFRESH_TIME;
  const match = time.match(/(\d+)([smhwd])/i);
  if (!match) return DEFAULT_REFRESH_TIME;
  const num = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const unitInMilliseconds = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
    y: 31556952000,
  };
  if (!unitInMilliseconds[unit]) return DEFAULT_REFRESH_TIME;
  return num * unitInMilliseconds[unit];
}
