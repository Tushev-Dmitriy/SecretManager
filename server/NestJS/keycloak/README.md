# Keycloak Setup для Secret Manager

## Запуск Keycloak

1. Перейдите в папку keycloak:

```bash
cd keycloak
```

2. Запустите Keycloak:

```bash
docker-compose up -d
```

3. Дождитесь полной загрузки (обычно 1-2 минуты)

## Доступ к консоли администратора

- URL: http://localhost:8080
- Username: `admin`
- Password: `admin_password`

## Настройка Realm и Client

### 1. Создание Realm

1. Войдите в админ-консоль Keycloak
2. Нажмите на выпадающий список realm (по умолчанию "master")
3. Нажмите "Create realm"
4. Имя realm: `corporate-secrets`
5. Нажмите "Create"

### 2. Создание Client

1. В realm `corporate-secrets` перейдите в "Clients"
2. Нажмите "Create client"
3. Заполните:
   - Client type: `OpenID Connect`
   - Client ID: `secrets-app`
   - Name: `Secrets Manager App`
4. Нажмите "Next"
5. Настройки:
   - Client authentication: `ON`
   - Authorization: `OFF`
   - Authentication flow: включить все стандартные потоки
6. Нажмите "Next"
7. Valid redirect URIs: `http://localhost:3000/auth/callback`
8. Нажмите "Save"

### 3. Получение Client Secret

1. Перейдите во вкладку "Credentials" созданного client
2. Скопируйте "Client secret"
3. Обновите значение `KEYCLOAK_CLIENT_SECRET` в .env файле

### 4. Создание пользователя для тестирования

1. Перейдите в "Users"
2. Нажмите "Create new user"
3. Заполните username, email, first name, last name
4. Нажмите "Create"
5. Перейдите во вкладку "Credentials"
6. Нажмите "Set password"
7. Введите пароль и снимите галочку "Temporary"

## Остановка Keycloak

```bash
docker-compose down
```

## Удаление данных

```bash
docker-compose down -v
```
