import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  AuthResponse,
  Payload_Access,
  Payload_Refresh,
} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async createAccessToken(payload: Payload_Access): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY_ACCESS,
      expiresIn: process.env.JWT_EXPIRES_IN_ACCESS || '15m',
    });
  }
  async createRefreshToken(payload: Payload_Refresh): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY_REFRESH,
      expiresIn: process.env.JWT_EXPIRES_IN_REFRESH || '7d',
    });
  }

  async verifyAccess(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY_ACCESS,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async verifyRefresh(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY_REFRESH,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async validateGoogleLogin(profile: any): Promise<any> {
    return { ...profile._json };
  }
}
