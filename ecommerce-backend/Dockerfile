# Etapa 1: Instalación de dependencias y construcción
FROM node:24-alpine AS builder

WORKDIR /app

# Copiar archivos de definición de paquetes
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código del monorepo
COPY . .

# Argumento para definir qué aplicación construir (products-service u orders-service)
ARG APP_NAME

# Generar el cliente de Prisma antes de construir para evitar errores de tipado
# En Prisma 7, el comando debe ejecutarse desde el directorio del servicio donde está prisma.config.ts
RUN cd apps/${APP_NAME} && npx prisma generate || true

RUN npx nest build ${APP_NAME}

# Etapa 2: Imagen de ejecución (Producción)
FROM node:24-alpine

# Instalar postgresql-client para ejecutar scripts SQL de seeding
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copiar solo lo necesario de la etapa anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Copiar archivos de Prisma (schemas y migraciones) para todos los servicios
COPY --from=builder /app/apps ./apps

# Copiar y configurar el script de entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Exponer el puerto (NestJS suele usar 3000 por defecto)
EXPOSE 3000

# Comando para arrancar la aplicación específica
ARG APP_NAME
ENV APP_TARGET=${APP_NAME}

# Usar entrypoint para ejecutar migraciones antes de iniciar la app
ENTRYPOINT ["/app/entrypoint.sh"]