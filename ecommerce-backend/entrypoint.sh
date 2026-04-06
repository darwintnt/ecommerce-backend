#!/bin/sh
set -e

echo "=================================================="
echo "Iniciando servicio: $APP_NAME"
echo "=================================================="

# Verificar que APP_NAME esté definido
if [ -z "$APP_NAME" ]; then
  echo "ERROR: La variable APP_NAME no está definida"
  exit 1
fi

CONFIG_PATH="apps/${APP_NAME}/prisma.config.ts"
SCHEMA_PATH="apps/${APP_NAME}/prisma/schema.prisma"

# Verificar que el config de Prisma existe
if [ ! -f "$CONFIG_PATH" ]; then
  echo "ERROR: No se encontró el archivo de configuración de Prisma en $CONFIG_PATH"
  exit 1
fi

if [ ! -f "$SCHEMA_PATH" ]; then
  echo "ERROR: No se encontró el schema de Prisma en $SCHEMA_PATH"
  exit 1
fi

echo "Configuración encontrada: $CONFIG_PATH"
echo "Schema encontrado: $SCHEMA_PATH"
echo "Ejecutando migraciones de Prisma..."

# Cambiar al directorio del servicio para que Prisma encuentre prisma.config.ts
cd "apps/${APP_NAME}"

# Ejecutar migraciones (solo aplica las pendientes, es idempotente)
npx prisma migrate deploy

MIGRATION_STATUS=$?

if [ $MIGRATION_STATUS -eq 0 ]; then
  echo "✓ Migraciones aplicadas exitosamente"
else
  echo "✗ Error al aplicar migraciones (código: $MIGRATION_STATUS)"
  echo "Intentando generar el cliente de Prisma..."
  
  # Intentar generar el cliente de Prisma por si acaso
  npx prisma generate
  
  # Reintentar migraciones
  npx prisma migrate deploy
  
  if [ $? -ne 0 ]; then
    echo "✗ Error al aplicar migraciones después de reintentar"
    exit 1
  fi
  
  echo "✓ Migraciones aplicadas exitosamente después de generar cliente"
fi

# Ejecutar seeder SQL si existe (solo para products-service la primera vez)
SEED_SQL="prisma/seed.sql"
if [ -f "$SEED_SQL" ]; then
  echo "=================================================="
  echo "Ejecutando seeder de datos iniciales..."
  echo "=================================================="
  
  # Ejecutar el script SQL (solo inserta si la tabla está vacía)
  psql "$DATABASE_URL" -f "$SEED_SQL"
  
  if [ $? -eq 0 ]; then
    echo "✓ Seeding completado"
  else
    echo "⚠️  Advertencia: El seeding falló, pero la aplicación continuará"
  fi
fi

# Volver al directorio raíz
cd /app

echo "=================================================="
echo "Iniciando aplicación: $APP_NAME"
echo "=================================================="

# Ejecutar la aplicación
exec node dist/apps/${APP_NAME}/main
