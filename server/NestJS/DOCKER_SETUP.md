# 🚀 Docker Deployment Guide

Полная система SSO аутентификации с Keycloak и NestJS в Docker контейнерах.

## 📋 Предварительные требования

- Docker и Docker Compose установлены
- Свободные порты: 3000 (NestJS), 8080 (Keycloak)

## 🚀 Быстрый запуск

### 1. Запуск всей системы одной командой:

```bash
docker-compose up --build
```

### 2. Или запуск в фоновом режиме:

```bash
docker-compose up --build -d
```

### 3. Просмотр логов:

```bash
# Все сервисы
docker-compose logs -f

# Только backend
docker-compose logs -f backend

# Только keycloak
docker-compose logs -f keycloak
```

## 🔧 Настройка Keycloak

После запуска системы:

1. **Откройте Keycloak**: http://localhost:8080
2. **Войдите как админ**:
   - Username: `admin`
   - Password: `admin_password`

3. **Создайте realm `corporate-secrets`** (если не существует)

4. **Создайте client `secrets-app`**:
   - Client type: `OpenID Connect`
   - Client authentication: `ON`
   - Valid redirect URIs: `http://localhost:3000/auth/callback`

5. **Скопируйте Client Secret** и обновите в docker-compose.yml

6. **Создайте пользователя для тестирования**

## 🧪 Тестирование

### 1. Проверка статуса сервисов:

```bash
curl http://localhost:3000/auth/profile
curl http://localhost:8080/health/ready
```

### 2. Инициация SSO входа:

Откройте в браузере: http://localhost:3000/auth/login

### 3. API тестирование:

```bash
# Получение профиля пользователя
curl -H "Authorization: Bearer <jwt-token>" \
     http://localhost:3000/auth/profile

# Декодирование JWT токена
curl "http://localhost:3000/auth/decode-token?token=<jwt-token>"
```

## 🔄 Управление контейнерами

### Остановка сервисов:

```bash
docker-compose down
```

### Остановка с удалением volumes:

```bash
docker-compose down -v
```

### Перезапуск конкретного сервиса:

```bash
docker-compose restart backend
docker-compose restart keycloak
```

### Пересборка образов:

```bash
docker-compose build --no-cache
```

## 📊 Мониторинг

### Проверка статуса контейнеров:

```bash
docker-compose ps
```

### Использование ресурсов:

```bash
docker stats
```

### Подключение к контейнеру:

```bash
# Backend
docker-compose exec backend sh

# Keycloak
docker-compose exec keycloak bash
```

## 🐛 Troubleshooting

### Проблемы с портами:

```bash
# Проверка занятых портов
netstat -tulpn | grep :3000
netstat -tulpn | grep :8080
```

### Проблемы с базой данных:

```bash
# Проверка подключения к Supabase
docker-compose exec backend npx prisma db pull
```

### Проблемы с Keycloak:

```bash
# Проверка логов Keycloak
docker-compose logs keycloak | tail -50
```

### Очистка Docker:

```bash
# Удаление неиспользуемых образов
docker system prune -a

# Удаление всех volumes
docker volume prune
```

## 🔧 Переменные окружения

Все переменные настроены в docker-compose.yml:

- `DATABASE_URL` - подключение к Supabase
- `KEYCLOAK_*` - настройки интеграции с Keycloak
- `JWT_SECRET` - секрет для подписи JWT токенов
- `SESSION_SECRET` - секрет для сессий

## 🏗️ Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │────│   NestJS API    │────│   Supabase DB   │
│   (Client)      │    │   (Port 3000)   │    │   (External)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────│    Keycloak     │
                        │   (Port 8080)   │
                        └─────────────────┘
```

## 📚 Что дальше?

- Настройте CI/CD для автоматического развертывания
- Добавьте мониторинг с помощью Prometheus/Grafana
- Настройте SSL сертификаты для продакшена
- Создайте фронтенд приложение
