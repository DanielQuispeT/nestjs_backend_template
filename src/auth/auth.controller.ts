import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import {
  clearRefreshTokenCookie,
  getMaxAge,
  setRefreshTokenCookie,
  tipo_cookie,
} from './utils/cookie.util';
import { Public } from '../common/decorators/public.decorator';
import { GoogleOauthGuard } from './guards/google-auth/google-auth.guard';
import { CredencialesService } from 'src/modules/credenciales/credenciales.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly credencialesService: CredencialesService,
  ) {}
  //### LOCAL AUTH ###
  @Public()
  @Post('login')
  async loginWithEmailAndPassword(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { payload_access, payload_refresh, permissions } =
      await this.credencialesService.loginWithEmailAndPassword(email, password);
    const accessToken = `Bearer ${await this.authService.createAccessToken(payload_access)}`;
    const refreshToken = `Bearer ${await this.authService.createRefreshToken(payload_refresh)}`;
    setRefreshTokenCookie(
      res,
      refreshToken,
      accessToken,
      permissions,
      process.env.FRONTEND_DOMAIN_CLIENT,
      true,
    );
  }

  @Public()
  @Post('login-admin')
  async loginWithEmailAndPasswordAdmin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { payload_access, payload_refresh, permissions } =
      await this.credencialesService.loginAdmin(email, password);
    const accessToken = `Bearer ${await this.authService.createAccessToken(payload_access)}`;
    const refreshToken = `Bearer ${await this.authService.createRefreshToken(payload_refresh)}`;
    setRefreshTokenCookie(
      res,
      refreshToken,
      accessToken,
      permissions,
      process.env.FRONTEND_DOMAIN_ADMIN,
      false,
    );
  }

  @Public()
  @Post('refresh-access-token')
  async refreshToken(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    let refreshTokenOld = req.cookies.refreshToken;
    if (!refreshTokenOld) return;
    refreshTokenOld = refreshTokenOld.replace('Bearer ', '');
    const { payload_access, payload_refresh, permissions } =
      await this.credencialesService.refreshAccessToken(refreshTokenOld);
    const accessToken = `Bearer ${await this.authService.createAccessToken(payload_access)}`;
    const refreshToken = `Bearer ${await this.authService.createRefreshToken(payload_refresh)}`;
    setRefreshTokenCookie(
      res,
      refreshToken,
      accessToken,
      permissions,
      process.env.FRONTEND_DOMAIN_CLIENT,
      true,
    );
  }

  @Public()
  @Post('refresh-access-token-admin')
  async refreshTokenAdmin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    let refreshTokenOld = req.cookies.refreshTokenAdmin;
    if (!refreshTokenOld) return;
    refreshTokenOld = refreshTokenOld.replace('Bearer ', '');
    const { payload_access, payload_refresh, permissions } =
      await this.credencialesService.refreshAccessToken(refreshTokenOld);
    const accessToken = `Bearer ${await this.authService.createAccessToken(payload_access)}`;
    const refreshToken = `Bearer ${await this.authService.createRefreshToken(payload_refresh)}`;

    setRefreshTokenCookie(
      res,
      refreshToken,
      accessToken,
      permissions,
      process.env.FRONTEND_DOMAIN_ADMIN,
      false,
    );
  }

  @Public()
  @Post('remove-refresh-token')
  async refreshTokenLogout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    clearRefreshTokenCookie(res, process.env.FRONTEND_DOMAIN_CLIENT, true);
  }

  @Public()
  @Post('remove-refresh-token-admin')
  async refreshTokenLogoutAdmin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    clearRefreshTokenCookie(res, process.env.FRONTEND_DOMAIN_ADMIN, false);
  }

  @Post('change-role')
  async changeRole(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    let refresh = req.cookies.refreshToken;
    if (!refresh) {
      throw new UnauthorizedException(
        'No se ha encontrado el token de refresco',
      );
    }
    refresh = refresh.replace('Bearer ', '');
    const change_role = req.body.rol_activo;
    const { payload_access, payload_refresh, permissions } =
      await this.credencialesService.changeRole(refresh, change_role);
    const accessToken = `Bearer ${await this.authService.createAccessToken(payload_access)}`;
    const refreshToken = `Bearer ${await this.authService.createRefreshToken(payload_refresh)}`;
    setRefreshTokenCookie(
      res,
      refreshToken,
      accessToken,
      permissions,
      process.env.FRONTEND_DOMAIN_ADMIN,
      false,
    );
  }

  //### GOOGLE AUTH ###
  @Public()
  @UseGuards(GoogleOauthGuard)
  @Get('google/login')
  async authGoogle() {}

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  async googleRegisterOrLogin(@Req() req: Request, @Res() res: Response) {
    const profileData = req.user as any;
    if (!profileData || !profileData.email)
      throw new BadRequestException('Datos de perfil de Google no válidos');
    const { payload_access, payload_refresh, permissions } =
      await this.credencialesService.googleRegisterOrLogin(profileData);

    const accessToken = `Bearer ${await this.authService.createAccessToken(payload_access)}`;
    const refreshToken = `Bearer ${await this.authService.createRefreshToken(payload_refresh)}`;
    const permissionsString = permissions.join(','); // Convertir array a string

    res.cookie(tipo_cookie[0].name_cookie, refreshToken, {
      httpOnly: true,
      domain: process.env.FRONTEND_DOMAIN_CLIENT,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: getMaxAge(),
      path: '/',
    });
    return res.redirect(
      `${process.env.FRONTEND_URL_CLIENT}/auth/v2/google/${accessToken}/${permissionsString}`,
    );
  }
}
