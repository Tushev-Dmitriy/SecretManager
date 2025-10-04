import { Controller, Get, UseGuards, Req, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @UseGuards(AuthGuard('keycloak'))
  async login() {
    // Этот эндпоинт просто инициирует OAuth2 поток с Keycloak
  }

  @Get('callback')
  @UseGuards(AuthGuard('keycloak'))
  async callback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const token = await this.authService.generateJwt(user);

    // Перенаправляем на фронтенд с токеном
    return res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  }

  @Get('success')
  success(@Query('token') token: string) {
    return {
      message: 'Successfully logged in with Keycloak SSO',
      token,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return {
      id: user.sub,
      email: user.email,
      role: user.role,
      message: 'User authenticated via Keycloak SSO',
      fullJwtPayload: user, // Показываем полный payload JWT
    };
  }

  @Get('decode-token')
  decodeToken(@Query('token') token: string) {
    if (!token) {
      return { error: 'Token is required' };
    }

    try {
      // Декодируем JWT без проверки подписи (только для просмотра)
      const base64Payload = token.split('.')[1];
      const decodedPayload = JSON.parse(
        Buffer.from(base64Payload, 'base64').toString('utf-8'),
      );

      return {
        message: 'JWT Token decoded successfully',
        payload: decodedPayload,
        userInfo: {
          id: decodedPayload.sub,
          email: decodedPayload.email,
          role: decodedPayload.role,
          issuedAt: new Date(decodedPayload.iat * 1000).toISOString(),
          expiresAt: new Date(decodedPayload.exp * 1000).toISOString(),
        },
      };
    } catch (error) {
      return { error: 'Invalid JWT token format' };
    }
  }
}
