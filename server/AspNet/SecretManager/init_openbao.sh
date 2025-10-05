#!/bin/bash
OPENBAO_ADDR="http://localhost:5227"
TOKEN="root"

echo "🔐 Инициализация OpenBao секретов..."

# Grafana API
curl --header "X-Vault-Token: $TOKEN" \
     --request POST \
     --data '{
       "data": {
         "api_key": "grafana-xyz-987"
       },
       "category": "REST_endpoints"
     }' \
     $OPENBAO_ADDR/api/secret/data/grafana-api

# PostgreSQL
curl --header "X-Vault-Token: $TOKEN" \
     --request POST \
     --data '{
       "data": {
         "username": "db_admin",
         "password": "SuperSecret123",
         "host": "prod-db.local"
       },
       "category": "PostgreSQL"
     }' \
     $OPENBAO_ADDR/api/secret/data/production-db

# Jenkins
curl --header "X-Vault-Token: $TOKEN" \
     --request POST \
     --data '{
       "data": {
         "token": "jenkins-abc-123",
         "job": "deploy-production"
       },
       "category": "Jenkins"
     }' \
     $OPENBAO_ADDR/api/secret/data/jenkins-token

# Telegram
curl --header "X-Vault-Token: $TOKEN" \
     --request POST \
     --data '{
       "data": {
         "bot_token": "123456789:ABCDEF-TelegramSecret"
       },
       "category": "REST_endpoints"
     }' \
     $OPENBAO_ADDR/api/secret/data/telegram-bot

echo "✅ OpenBao инициализация завершена."
