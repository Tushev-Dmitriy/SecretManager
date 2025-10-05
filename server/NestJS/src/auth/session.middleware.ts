import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('=== SESSION MIDDLEWARE ===');
    console.log('Path:', req.path);
    console.log('Method:', req.method);
    console.log('Query:', req.query);

    // Проверяем, что сессия инициализирована
    if (!req.session) {
      console.error('Session not initialized for path:', req.path);
      return res.status(500).json({ error: 'Session not initialized' });
    }

    console.log('Session ID:', req.session.id);
    console.log('Session data keys:', Object.keys(req.session));

    // Добавим обработку ошибок Passport
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
    });

    next();
  }
}
