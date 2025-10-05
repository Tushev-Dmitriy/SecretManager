import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: true,
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
    console.log('Serializing user:', user);
    done(null, user?.id || user);
  });

  passport.deserializeUser(async (id: string, done: any) => {
    try {
      console.log('Deserializing user ID:', id);
      done(null, { id });
    } catch (error) {
      console.error('Deserialize error:', error);
      done(error, undefined);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Secret Manager API')
    .setDescription(
      'API для управления корпоративными секретами с SSO аутентификацией через Keycloak',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Аутентификация и авторизация')
    .addTag('users', 'Управление пользователями')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:3000`);
  console.log(`Swagger documentation: http://0.0.0.0:3000/api`);
}
bootstrap();
