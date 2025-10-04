# Simple SSO Authentication with Keycloak

Простая система SSO авторизации с использованием Keycloak для NestJS приложения.

## 🚀 Быстрый старт

### 1. Запуск Keycloak

```bash
cd keycloak
docker-compose up -d
```

Дождитесь запуска Keycloak (1-2 минуты), затем откройте http://localhost:8080

### 2. Настройка Keycloak

#### Вход в админ панель

- URL: http://localhost:8080
- Username: `admin`
- Password: `admin_password`

#### Создание Realm

1. Нажмите на выпадающий список realm (сверху слева)
2. Выберите "Create realm"
3. Name: `corporate-secrets`
4. Нажмите "Create"

#### Создание Client

1. Перейдите в "Clients" → "Create client"
2. Заполните:
   - Client ID: `secrets-app`
   - Client type: `OpenID Connect`
3. Нажмите "Next"
4. Настройки:
   - Client authentication: `ON`
5. Нажмите "Next"
6. Valid redirect URIs: `http://localhost:3000/auth/callback`
7. Нажмите "Save"

#### Получение Client Secret

1. Перейдите во вкладку "Credentials" созданного client
2. Скопируйте "Client secret"
3. Обновите `KEYCLOAK_CLIENT_SECRET` в .env файле

#### Создание тестового пользователя

1. Перейдите в "Users" → "Create new user"
2. Заполните:
   - Username: `testuser`
   - Email: `test@example.com`
   - First name: `Test`
   - Last name: `User`
3. Нажмите "Create"
4. Перейдите в "Credentials" → "Set password"
5. Password: `password123`
6. Снимите галочку "Temporary"

### 3. Запуск NestJS приложения

```bash
# Установка зависимостей
yarn install

# Запуск в режиме разработки
yarn start:dev
```

## 🔧 API Endpoints

### Аутентификация

#### 1. Инициация входа

```
GET http://localhost:3000/auth/login
```

Перенаправит в Keycloak для входа

#### 2. Callback (обрабатывается автоматически)

```
GET http://localhost:3000/auth/callback
```

Keycloak перенаправит сюда после успешной авторизации

#### 3. Страница успешной авторизации

```
GET http://localhost:3000/auth/success?token=<jwt-token>
```

Возвращает информацию о успешной авторизации

#### 4. Получение профиля пользователя

```
GET http://localhost:3000/auth/profile
Authorization: Bearer <your-jwt-token>
```

## 📝 Пример использования

### 1. Откройте браузер и перейдите на:

```
http://localhost:3000/auth/login
```

### 2. Вас перенаправит в Keycloak для входа

- Введите логин: `testuser`
- Введите пароль: `password123`

### 3. После успешного входа вас перенаправит на:

```
http://localhost:3001/auth/success?token=<jwt-token>
```

### 4. Используйте полученный JWT токен для доступа к защищенным ресурсам:

```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
     http://localhost:3000/auth/profile
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

## 🏗 Архитектура

### Компоненты системы:

1. **Keycloak Server** (порт 8080)
   - Сервер авторизации
   - Управление пользователями
   - OAuth2/OIDC провайдер

2. **NestJS Backend** (порт 3000)
   - REST API
   - JWT токены
   - Passport.js интеграция

### Процесс авторизации:

1. Пользователь переходит на `/auth/login`
2. Перенаправление в Keycloak для входа
3. Keycloak проверяет учетные данные
4. Обратное перенаправление в `/auth/callback`
5. Создание JWT токена
6. Перенаправление на фронтенд с токеном

## 🐛 Troubleshooting

### Keycloak не запускается

- Проверьте, что порт 8080 свободен
- Проверьте подключение к Supabase

### Ошибки аутентификации

- Убедитесь, что Client Secret правильный
- Проверьте redirect URIs в настройках client
- Проверьте, что realm `corporate-secrets` создан

### JWT ошибки

- Проверьте JWT_SECRET в .env
- Убедитесь, что токен передается в заголовке Authorization

## 📚 Что дальше?

Эта система предоставляет базовую SSO авторизацию. Вы можете расширить ее:

1. Добавить роли и права доступа
2. Создать фронтенд приложение
3. Интегрировать с другими сервисами
4. Добавить аудит операций
