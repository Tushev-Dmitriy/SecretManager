import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-openidconnect';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import passport from 'passport';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  private readonly logger = new Logger(KeycloakStrategy.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      issuer: configService.get(
        'KEYCLOAK_INTERNAL_URL',
        configService.get('KEYCLOAK_ISSUER', ''),
      ),
      authorizationURL: `${configService.get('KEYCLOAK_ISSUER')}/protocol/openid-connect/auth`,
      tokenURL: `${configService.get('KEYCLOAK_INTERNAL_URL', configService.get('KEYCLOAK_ISSUER', ''))}/protocol/openid-connect/token`,
      userInfoURL: `${configService.get('KEYCLOAK_INTERNAL_URL', configService.get('KEYCLOAK_ISSUER', ''))}/protocol/openid-connect/userinfo`,
      clientID: configService.get('KEYCLOAK_CLIENT_ID', ''),
      clientSecret: configService.get('KEYCLOAK_CLIENT_SECRET', ''),
      callbackURL: configService.get('KEYCLOAK_REDIRECT_URI', ''),
      scope: 'openid profile email',
    });
  }

  async validate(...args: any[]): Promise<any> {
    // Log all arguments for debugging
    this.logger.debug('Validate arguments:', JSON.stringify(args, null, 2));

    // Expecting at least 3 arguments: accessToken (or issuer), profile (or refreshToken), done (or null)
    const accessToken = args[0];
    let userProfile = args[1];
    let done = args[2];

    // If done is not a function, assume it's missing and use a fallback
    if (typeof done !== 'function') {
      this.logger.warn('done is not a function, using default callback');
      done = (err: any, user: any) => {
        if (err) {
          throw err; // Let NestJS handle the error
        }
        return user; // Return user directly for NestJS
      };
    }

    // Check if profile is available; if not, try to use args[1] as profile
    if (!userProfile || !userProfile.id) {
      this.logger.error('Invalid profile or id:', userProfile?.id);
      return done(
        new Error('Invalid profile or id in Keycloak response'),
        undefined,
      );
    }

    // Log the accessToken for debugging
    this.logger.debug('AccessToken:', accessToken);

    const role = userProfile._json?.realm_access?.roles?.includes('ADMIN')
      ? 'ADMIN'
      : 'USER';
    const email =
      userProfile.emails?.[0]?.value || `${userProfile.id}@example.com`;
    const username = userProfile.username || `user_${userProfile.id}`;

    try {
      const user = await this.prisma.user.upsert({
        where: { id: userProfile.id },
        update: {
          email,
          username,
          role,
        },
        create: {
          id: userProfile.id,
          email,
          username,
          role,
          passwordHash: null,
        },
      });

      return done(null, user);
    } catch (error) {
      this.logger.error('Error during user upsert:', error);
      return done(error, undefined);
    }
  }
}
