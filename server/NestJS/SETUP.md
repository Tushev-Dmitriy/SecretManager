# Secret Manager - Setup Instructions

## 🚀 Быстрый старт

### 1. Запуск Keycloak

```bash
cd keycloak
docker-compose up -d
```

Дождитесь запуска Keycloak (1-2 минуты), затем откройте http://localhost:8080

### 2. Настройка Keycloak

1. **Вход в админ панель**
   - URL: http://localhost:8080
   - Username: `admin`
   - Password: `admin_password`

2. **Создание Realm**
   - Нажмите на выпадающий список realm (сверху слева)
   - Выберите "Create realm"
   - Name: `corporate-secrets`
   - Нажмите "Create"

3. **Создание Client**
   - Перейдите в "Clients" → "Create client"
   - Client ID: `secrets-app`
   - Client type: `OpenID Connect`
   - Нажмите "Next"
   - Client authentication: `ON`
   - Нажмите "Next"
   - Valid redirect URIs: `http://localhost:3000/auth/callback`
   - Нажмите "Save"

4. **Получение Client Secret**
   - Во вкладке "Credentials" скопируйте Client secret
   - Обновите `KEYCLOAK_CLIENT_SECRET` в .env файле

5. **Создание тестового пользователя**
   - Перейдите в "Users" → "Create new user"
   - Username: `testuser`
   - Email: `test@example.com`
   - First name: `Test`
   - Last name: `User`
   - Нажмите "Create"
   - Перейдите в "Credentials" → "Set password"
   - Password: `password123`
   - Снимите галочку "Temporary"

6. **Создание админ пользователя (опционально)**
   - Создайте пользователя `admin`
   - Перейдите в "Role mapping"
   - Нажмите "Assign role"
   - Найдите и выберите роль с "ADMIN" в названии

### 3. Запуск бэкенда

```bash
# Установка зависимостей
npm install

# Применение миграций Prisma
npx prisma migrate dev

# Запуск в режиме разработки
npm run start:dev
```

### 4. Тестирование API

#### Аутентификация

1. **Инициация входа**

   ```
   GET http://localhost:3000/auth/login
   ```

   Это перенаправит в Keycloak для входа

2. **Получение профиля пользователя**
   ```
   GET http://localhost:3000/auth/profile
   Authorization: Bearer <your-jwt-token>
   ```

#### Работа с секретами

1. **Создание заявки на секрет**

   ```
   POST http://localhost:3000/secrets/request
   Authorization: Bearer <your-jwt-token>
   Content-Type: application/json

   {
     "resource": "database-password",
     "reason": "Need access to production database for debugging"
   }
   ```

2. **Получение своих секретов**

   ```
   GET http://localhost:3000/secrets
   Authorization: Bearer <your-jwt-token>
   ```

3. **Просмотр всех заявок (только для админов)**

   ```
   GET http://localhost:3000/secrets/requests
   Authorization: Bearer <admin-jwt-token>
   ```

4. **Одобрение заявки (только для админов)**

   ```
   POST http://localhost:3000/secrets/approve/:id
   Authorization: Bearer <admin-jwt-token>
   Content-Type: application/json

   {
     "requestId": "uuid-of-request"
   }
   ```

## 🔧 Переменные окружения

Убедитесь, что ваш `.env` файл содержит:

```env
DATABASE_URL=postgresql://postgres.hfqrijwbxklnuaszsxmb:biteTheDust@aws-1-eu-north-1.pooler.supabase.com:5432/postgres
KEYCLOAK_ISSUER=http://localhost:8080/realms/corporate-secrets
KEYCLOAK_INTERNAL_URL=http://keycloak:8080/realms/corporate-secrets
KEYCLOAK_CLIENT_ID=secrets-app
KEYCLOAK_CLIENT_SECRET=your-actual-client-secret-from-keycloak
KEYCLOAK_REDIRECT_URI=http://localhost:3000/auth/callback
JWT_SECRET=32c06da051ca95a5449f0d3b881473281be38c106dd0b92665cfdf2a2c512a69
SESSION_SECRET=5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d
```

## 🐛 Troubleshooting

1. **Keycloak не запускается**
   - Проверьте, что порт 8080 свободен
   - Проверьте подключение к Supabase

2. **Ошибки аутентификации**
   - Убедитесь, что Client Secret правильный
   - Проверьте redirect URIs в настройках client

3. **Ошибки базы данных**
   - Выполните `npx prisma migrate reset`
   - Проверьте DATABASE_URL

## 📚 Следующие шаги

1. Интеграция с OpenBao для хранения секретов
2. Создание фронтенд приложения
3. Добавление аудита операций
4. Реализация локального клиента
