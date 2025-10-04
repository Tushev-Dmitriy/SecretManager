import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  app.use(
    session({
      secret: configService.get(
        'SESSION_SECRET',
        '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
      ),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, // 24 часа
        httpOnly: true,
      },
    }),
  );

  // Configure passport serialization
  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done: any) => {
    try {
      // Note: You might want to inject PrismaService here for user lookup
      done(null, { id });
    } catch (error) {
      done(error, undefined);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:3000`);
}
bootstrap();
