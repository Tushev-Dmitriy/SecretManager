-- Initialize Keycloak database schema
CREATE SCHEMA IF NOT EXISTS keycloak;

-- Grant necessary permissions to the postgres user for the keycloak schema
GRANT ALL PRIVILEGES ON SCHEMA keycloak TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA keycloak TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA keycloak TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA keycloak TO postgres;

-- Set default privileges for future objects in the keycloak schema
ALTER DEFAULT PRIVILEGES IN SCHEMA keycloak GRANT ALL PRIVILEGES ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA keycloak GRANT ALL PRIVILEGES ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA keycloak GRANT ALL PRIVILEGES ON FUNCTIONS TO postgres;