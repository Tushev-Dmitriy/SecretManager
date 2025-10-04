-- Создаем схему keycloak для Keycloak
CREATE SCHEMA IF NOT EXISTS keycloak;

-- Выдаем права на схему keycloak
GRANT ALL PRIVILEGES ON SCHEMA keycloak TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA keycloak TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA keycloak TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA keycloak TO postgres;

-- Устанавливаем права по умолчанию для будущих объектов в схеме keycloak
ALTER DEFAULT PRIVILEGES IN SCHEMA keycloak GRANT ALL PRIVILEGES ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA keycloak GRANT ALL PRIVILEGES ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA keycloak GRANT ALL PRIVILEGES ON FUNCTIONS TO postgres;

-- Схема public уже существует по умолчанию для приложения