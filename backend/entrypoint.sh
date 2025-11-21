#!/bin/sh

echo "Esperando a la base de datos en $DB_HOST:$DB_PORT..."

while ! nc -z "$DB_HOST" "$DB_PORT"; do
  echo "DB no disponible aún, reintentando..."
  sleep 2
done

echo "Base de datos lista. Ejecutando migraciones..."
npx sequelize-cli db:migrate \
  --config src/config/config.json \
  --migrations-path src/migrations \
  --models-path src/models

echo "Ejecutando seeders..."
npx sequelize-cli db:seed:all \
  --config src/config/config.json \
  --seeders-path src/seeders

echo "Levantando servidor..."
npm run dev
