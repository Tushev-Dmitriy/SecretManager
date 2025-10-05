import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async generateJwt(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const secret = this.configService.get<string>('JWT_SECRET');

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '24h',
    });
  }

  getKeycloakIssuer(): string {
    return this.configService.get<string>(
      'KEYCLOAK_ISSUER',
      'http://localhost:8080/realms/corporate-secrets',
    );
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
