import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @UseGuards(AuthGuard('keycloak'))
  async login() {}

  @Get('callback')
  @UseGuards(AuthGuard('keycloak'))
  async callback(@Req() req, @Res() res: express.Response) {
    const user = req.user;
    console.log(user);
    const token = await this.authService.generateJwt(user);
    console.log(token);
    return res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  }

  @Get('success')
  success(@Req() req) {
    return {
      message: 'Successfully logged in',
      user: req.user,
      token: req.query.token,
    };
  }
}
