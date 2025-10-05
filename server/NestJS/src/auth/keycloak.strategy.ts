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
    const externalIssuer = configService.get('KEYCLOAK_ISSUER', '');
    const internalIssuer = configService.get(
      'KEYCLOAK_INTERNAL_URL',
      externalIssuer,
    );
    const clientId = configService.get('KEYCLOAK_CLIENT_ID', '');
    const clientSecret = configService.get('KEYCLOAK_CLIENT_SECRET', '');
    const callbackURL = configService.get('KEYCLOAK_REDIRECT_URI', '');

    console.log('=== KEYCLOAK STRATEGY CONFIGURATION ===');
    console.log('External Issuer (for browser):', externalIssuer);
    console.log('Internal Issuer (for backend):', internalIssuer);
    console.log('Client ID:', clientId);
    console.log('Callback URL:', callbackURL);

    super({
      issuer: externalIssuer, // Используем external issuer для соответствия с фронтенд запросами
      authorizationURL: `${externalIssuer}/protocol/openid-connect/auth?prompt=login&max_age=0`,
      tokenURL: `${internalIssuer}/protocol/openid-connect/token`,
      userInfoURL: `${internalIssuer}/protocol/openid-connect/userinfo`,
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
      scope: 'openid profile email',
    });

    console.log('Strategy configured successfully');
  }

  async validate(...args: any[]): Promise<any> {
    try {
      console.log('=== KEYCLOAK STRATEGY VALIDATE START ===');
      console.log('Args count:', args.length);
      console.log(
        'Args types:',
        args.map((arg, i) => `${i}: ${typeof arg}`),
      );

      // Standard OpenID Connect flow returns: accessToken, refreshToken, profile, done
      let accessToken, refreshToken, userProfile, done;

      if (args.length >= 4) {
        // Standard flow: accessToken, refreshToken, profile, done
        [accessToken, refreshToken, userProfile, done] = args;
        console.log('Using 4-argument pattern');
      } else if (args.length === 3) {
        // Possible alternative: accessToken, profile, done
        [accessToken, userProfile, done] = args;
        console.log('Using 3-argument pattern');
      } else {
        console.error('Unexpected number of arguments:', args.length);
        console.error('Raw args:', args);
        throw new Error(`Unexpected arguments count: ${args.length}`);
      }

      console.log('Access token exists:', !!accessToken);
      console.log('Profile exists:', !!userProfile);
      console.log('Profile type:', typeof userProfile);
      console.log(
        'Profile keys:',
        userProfile ? Object.keys(userProfile) : 'none',
      );
      console.log('Full profile:', JSON.stringify(userProfile, null, 2));

      // Check if profile is available
      if (!userProfile) {
        this.logger.error('No user profile received from Keycloak');
        throw new Error('No user profile received from Keycloak');
      }

      // Check for user ID in various possible fields
      const userId =
        userProfile.id || userProfile.sub || userProfile.preferred_username;
      if (!userId) {
        this.logger.error('No user ID found in profile:', userProfile);
        throw new Error('No user ID found in Keycloak profile');
      }

      // Log the accessToken for debugging
      this.logger.debug('AccessToken:', accessToken);

      const role = userProfile._json?.realm_access?.roles?.includes('ADMIN')
        ? 'ADMIN'
        : 'USER';
      const email =
        userProfile.emails?.[0]?.value ||
        userProfile.email ||
        `${userId}@example.com`;
      const username =
        userProfile.username ||
        userProfile.preferred_username ||
        `user_${userId}`;

      const user = await this.prisma.user.upsert({
        where: { id: userId },
        update: {
          email,
          username,
          role,
        },
        create: {
          id: userId,
          email,
          username,
          role,
          passwordHash: null,
        },
      });

      console.log('User created/updated:', user);
      return user;
    } catch (error) {
      console.error('Keycloak validation error:', error);
      this.logger.error('Error during Keycloak validation:', error);
      throw error;
    }
  }
}
