import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateJwt(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const secret = this.configService.get<string>('JWT_SECRET');

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '24h',
    });
  }
}
