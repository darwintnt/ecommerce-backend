# E-commerce Backend - Microservicios

[![CI](https://github.com/darwintnt/ecommerce-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/darwintnt/ecommerce-backend/actions/workflows/ci.yml)
[![CD](https://github.com/darwintnt/ecommerce-backend/actions/workflows/cd.yml/badge.svg)](https://github.com/darwintnt/ecommerce-backend/actions/workflows/cd.yml)
[![Release](https://img.shields.io/github/v/release/darwintnt/ecommerce-backend?label=version)](https://github.com/darwintnt/ecommerce-backend/releases)
[![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)](LICENSE)

Sistema de e-commerce basado en microservicios usando NestJS, Prisma, PostgreSQL y LocalStack (AWS local).

## 📋 Descripción

Proyecto de e-commerce con arquitectura de microservicios que incluye:

- **Products Service**: Gestión de productos (puerto 3001)
- **Orders Service**: Gestión de pedidos (puerto 3002)
- **PostgreSQL**: Base de datos relacional
- **LocalStack**: Simulación de servicios AWS (API Gateway, S3, Lambda, SNS, SQS)

## 🚀 Características

- ✅ **Migraciones automáticas**: Las migraciones de Prisma se ejecutan automáticamente al iniciar los contenedores
- ✅ **Seeder automático**: 20 productos se insertan automáticamente la primera vez
- ✅ **Persistencia de datos**: Los datos se mantienen entre reinicios (usando Docker volumes)
- ✅ **Hot reload**: Desarrollo con recarga automática
- ✅ **Monorepo**: Todos los microservicios en un único repositorio
- ✅ **CI/CD Pipeline**: Integración y despliegue continuo con GitHub Actions
- ✅ **Versionado automático**: Semantic release con conventional commits
- ✅ **Validación de productos**: Verifica existencia y stock antes de crear órdenes
- ✅ **Comunicación event-driven**: SNS/SQS para eventos entre servicios

## 🔄 CI/CD Pipeline

Este proyecto implementa un pipeline completo de CI/CD usando GitHub Actions.

### Workflows Disponibles

#### 1. **CI - Continuous Integration** (`.github/workflows/ci.yml`)

Se ejecuta automáticamente en:

- Push a ramas `main` y `develop`
- Pull requests a `main` y `develop`

**Jobs ejecutados**:

1. **Setup**: Instala dependencias y configura cache
2. **Lint**: Ejecuta ESLint en todo el monorepo
3. **Test**: Ejecuta tests unitarios y genera reporte de coverage
4. **Build Products**: Compila el microservicio de productos
5. **Build Orders**: Compila el microservicio de pedidos

**Artifacts generados**:

- `products-service-dist`: Código compilado del servicio de productos
- `orders-service-dist`: Código compilado del servicio de pedidos
- `coverage-report`: Reporte de cobertura de tests

#### 2. **CD - Continuous Deployment** (`.github/workflows/cd.yml`)

Se ejecuta automáticamente en:

- Push a rama `main` (después de merge)

**Jobs ejecutados**:

1. **Version**: Ejecuta semantic-release para:
   - Analizar commits (conventional commits)
   - Determinar nueva versión (major, minor, patch)
   - Actualizar `package.json` y `CHANGELOG.md`
   - Crear tag de Git
   - Publicar GitHub Release

2. **Build Docker Images**: Construye y publica imágenes Docker:
   - `products-service:{version}` y `products-service:latest`
   - `orders-service:{version}` y `orders-service:latest`
   - Push a GitHub Container Registry (ghcr.io)

3. **Deploy Simulation**: Despliega servicios con Docker Compose y ejecuta smoke tests:
   - Inicia todos los servicios (postgres, localstack, products, orders)
   - Verifica healthchecks
   - Ejecuta tests HTTP en ambos servicios
   - Rollback automático si fallan los tests

#### 3. **Manual Release** (`.github/workflows/release.yml`)

Workflow manual para despliegues controlados.

**Parámetros**:

- `environment`: staging | production | localstack
- `version-tag`: Versión a desplegar (ej: `v1.0.0` o `latest`)
- `run-tests`: Ejecutar smoke tests después del deploy

**Cómo ejecutar**:

1. Ve a "Actions" en GitHub
2. Selecciona "Manual Release"
3. Click en "Run workflow"
4. Completa los parámetros y ejecuta

### Conventional Commits

El proyecto usa [Conventional Commits](https://www.conventionalcommits.org/) para versionado automático:

```bash
# Incrementa versión MINOR (0.1.0 → 0.2.0)
feat: agregar validación de stock en órdenes

# Incrementa versión PATCH (0.1.0 → 0.1.1)
fix: corregir error en cálculo de total

# Incrementa versión MAJOR (0.1.0 → 1.0.0)
feat!: cambiar estructura de API

BREAKING CHANGE: los endpoints ahora requieren autenticación

# No genera nueva versión
docs: actualizar README con ejemplos
chore: actualizar dependencias
```

**Tipos de commits válidos**:

- `feat`: Nueva funcionalidad → versión MINOR
- `fix`: Corrección de bug → versión PATCH
- `perf`: Mejora de rendimiento → versión PATCH
- `refactor`: Refactorización → versión PATCH
- `docs`: Documentación → no genera versión
- `test`: Tests → no genera versión
- `chore`: Tareas de mantenimiento → no genera versión
- `ci`: Cambios en CI/CD → no genera versión

### Proceso de Release

1. **Desarrollo**: Trabaja en una rama feature

   ```bash
   git checkout -b feature/nueva-funcionalidad
   # Haz cambios...
   git add .
   git commit -m "feat: descripción de la nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

2. **Pull Request**: Crea PR a `main`
   - El workflow CI se ejecuta automáticamente
   - Debe pasar lint, tests y builds
   - Revisión de código

3. **Merge a Main**: Cuando el PR es aprobado y mergeado
   - El workflow CD se ejecuta automáticamente
   - Semantic release determina la nueva versión
   - Se actualiza `CHANGELOG.md`
   - Se crea un tag de Git
   - Se construyen imágenes Docker
   - Se ejecuta deploy simulation

4. **GitHub Release**: Se crea automáticamente con notas de versión

### Verificar Estado del Pipeline

```bash
# Ver estado de workflows
gh workflow list

# Ver runs recientes
gh run list

# Ver detalles de un run específico
gh run view <run-id>

# Ver logs de un workflow
gh run view <run-id> --log
```

### Variables de Entorno y Secrets

Para que el pipeline funcione correctamente, configura estos secrets en GitHub:

1. **`GITHUB_TOKEN`**: Generado automáticamente por GitHub (no requiere configuración)
2. **`DOCKER_USERNAME`** (opcional): Usuario de Docker Hub si quieres push a Docker Hub
3. **`DOCKER_PASSWORD`** (opcional): Token de acceso de Docker Hub

**Cómo configurar secrets**:

1. Ve a Settings → Secrets and variables → Actions
2. Click en "New repository secret"
3. Agrega nombre y valor del secret

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Docker**: versión 20.10 o superior
- **Docker Compose**: versión 2.0 o superior
- **Node.js**: versión 22 o superior (solo para desarrollo local sin Docker)
- **npm o pnpm**: para instalar dependencias localmente

### Verificar instalación

```bash
docker --version
docker-compose --version
```

## 🏗️ Estructura del Proyecto

```
main_folder/
├── docker-compose.yml           # Orquestación de contenedores
├── init-databases.sh            # Script para crear bases de datos
├── init-aws.sh                  # Script para configurar LocalStack
├── api-gateway.yml              # Configuración de API Gateway
└── ecommerce-backend/           # Monorepo de microservicios
    ├── Dockerfile               # Imagen Docker para los servicios
    ├── entrypoint.sh            # Script de inicio (migraciones + seeder)
    ├── package.json             # Dependencias compartidas
    ├── apps/
    │   ├── products-service/    # Microservicio de productos
    │   │   ├── prisma/
    │   │   │   ├── schema.prisma      # Schema de base de datos
    │   │   │   ├── migrations/        # Migraciones de Prisma
    │   │   │   └── seed.sql           # Datos iniciales (20 productos)
    │   │   ├── prisma.config.ts       # Configuración de Prisma 7
    │   │   └── src/
    │   └── orders-service/      # Microservicio de pedidos
    │       ├── prisma/
    │       │   ├── schema.prisma
    │       │   └── migrations/
    │       ├── prisma.config.ts
    │       └── src/
    └── libs/                    # Librerías compartidas
```

## 🔧 Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/darwintnt/ecommerce-backend
cd ecommerce-backend
```

### 2. Variables de entorno

Las variables de entorno ya están configuradas en `docker-compose.yml`:

- **PostgreSQL**:
  - Usuario: `admin`
  - Contraseña: `ecommerce_pass`
  - Base de datos principal: `ecommerce_main`
  - Bases de datos de servicios: `products_db`, `orders_db`

- **LocalStack**:
  - Endpoint: `http://localhost:4566`
  - Token de autenticación incluido

## 🚀 Ejecución del Proyecto

### Opción 1: Primera ejecución (limpia)

```bash
# 1. Asegúrate de que no haya contenedores previos
docker-compose down -v

# 2. Construir las imágenes
docker-compose build --no-cache

# 3. Iniciar todos los servicios
docker-compose up -d

# 4. Ver logs en tiempo real alki buscar la propiedad PI Gateway ID que se requerira para poder consumir los endpoints por medio del API GATEWAY simulado usando localstack
docker-compose logs -f
```

### Opción 2: Ejecución normal (después de la primera vez)

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f products_service orders_service
```

### Detener servicios

```bash
# Detener sin borrar datos
docker-compose down

# Detener y borrar todos los datos (volúmenes)
docker-compose down -v
```

## ✅ Verificación

### 1. Verificar que los contenedores están corriendo

```bash
docker-compose ps
```

Deberías ver:

- `postgres_ecommerce` (healthy)
- `localstack_ecommerce` (healthy)
- `products_service` (running)
- `orders_service` (running)

### 2. Verificar las migraciones y seeder en los logs

```bash
docker-compose logs products_service | grep -A 5 "Migraciones"
docker-compose logs products_service | grep -A 3 "Seeding"
```

Deberías ver:

```
✓ Migraciones aplicadas exitosamente
✓ Seeding completado
```

### 3. Verificar productos insertados

```bash
# Conectar a la base de datos
docker exec -it postgres_ecommerce psql -U admin -d products_db

# Dentro de psql, ejecutar:
SELECT COUNT(*) FROM products;
SELECT name, price, sku FROM products LIMIT 5;

# Salir de psql
\q
```

### 4. Probar endpoints de productos

```bash
# Listar todos los productos
curl http://localhost:3001/products

# Obtener un producto por ID
curl http://localhost:3001/products/{id}

# Crear un producto
curl -X POST http://localhost:4566/_aws/execute-api/{API_ID}/dev/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Producto Test",
    "description": "Descripción del producto",
    "price": 99900,
    "stock": 10
  }'
```

### 5. Probar endpoints de pedidos

```bash
# Listar pedidos
curl http://localhost:4566/_aws/execute-api/{API_ID}/dev/orders

# Crear un pedido
curl -X POST http://localhost:4566/_aws/execute-api/{API_ID}/dev/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "uuid-del-cliente",
    "totalAmount": "200000",
    "orderItems": [
      {
        "productId": "uuid-del-producto",
        "quantity": 2,
        "unitPrice": "100000"
      }
    ]
  }'
```

## 🛠️ Comandos Útiles

### Docker

```bash
# Ver logs de un servicio específico
docker-compose logs -f products_service

# Reiniciar un servicio
docker-compose restart products_service

# Reconstruir un servicio específico
docker-compose build products_service

# Ejecutar comandos dentro de un contenedor
docker exec -it products_service sh

# Ver uso de recursos
docker stats
```

### Base de datos

```bash
# Conectar a PostgreSQL
docker exec -it postgres_ecommerce psql -U admin -d products_db

# Comandos útiles en psql:
\dt                    # Listar tablas
\d products            # Describir tabla products
\l                     # Listar bases de datos
\c orders_db           # Cambiar a otra base de datos
\q                     # Salir

# Ejecutar query desde la terminal
docker exec -it postgres_ecommerce psql -U admin -d products_db -c "SELECT * FROM products LIMIT 5;"

# Backup de base de datos
docker exec postgres_ecommerce pg_dump -U admin products_db > products_backup.sql

# Restaurar backup
docker exec -i postgres_ecommerce psql -U admin -d products_db < products_backup.sql
```

### LocalStack (AWS local)

```bash
# Verificar salud de LocalStack
curl http://localhost:4566/_localstack/health

# Listar API Gateways
awslocal --endpoint-url=http://localhost:4566 apigateway get-rest-apis

# Ver buckets S3
awslocal --endpoint-url=http://localhost:4566 s3 ls

# Listar colas SQS
awslocal --endpoint-url=http://localhost:4566 sqs list-queues
```

### Volúmenes Docker

```bash
# Listar volúmenes
docker volume ls

# Ver detalles del volumen de PostgreSQL
docker volume inspect ecommerce-backend_postgres_data

# Borrar volúmenes huérfanos
docker volume prune
```

## 🔄 Flujo de Trabajo de Desarrollo

### 1. Agregar una nueva migración

```bash
# Dentro del contenedor o localmente con las dependencias instaladas
cd ecommerce-backend

# Para products-service
cd apps/products-service
npx prisma migrate dev --name nombre_de_la_migracion

# Reconstruir la imagen para incluir la nueva migración
docker-compose build products_service
docker-compose up -d products_service
```

### 2. Regenerar el cliente de Prisma

```bash
cd apps/products-service
npx prisma generate
```

### 3. Ver el esquema de la base de datos con Prisma Studio

```bash
# Localmente (requiere dependencias instaladas)
cd ecommerce-backend/apps/products-service
DATABASE_URL="postgresql://admin:ecommerce_pass@localhost:5432/products_db" npx prisma studio
```

## 🐛 Troubleshooting

### Los contenedores no inician

```bash
# Ver logs detallados
docker-compose logs

# Verificar puertos en uso
lsof -i :3001
lsof -i :3002
lsof -i :5432

# Limpiar todo y empezar de nuevo
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

### Las migraciones no se ejecutan

```bash
# Ver logs del servicio para identificar el error
docker-compose logs products_service | grep -i error

# Ejecutar migraciones manualmente
docker exec -it products_service sh
cd apps/products-service
npx prisma migrate deploy
```

### Los datos se borran al reiniciar

```bash
# Verificar que el volumen existe
docker volume ls | grep postgres

# NO uses docker-compose down -v si quieres mantener los datos
# Usa solo: docker-compose down
```

### El seeder no inserta productos

```bash
# Verificar que la tabla existe
docker exec -it postgres_ecommerce psql -U admin -d products_db -c "\dt"

# Verificar el estado del seeder en los logs
docker-compose logs products_service | grep -A 10 "seeder"

# Ejecutar el seeder manualmente
docker exec -it postgres_ecommerce psql -U admin -d products_db -f /path/to/seed.sql
```

## 📚 Tecnologías Utilizadas

- **NestJS**: Framework de Node.js para aplicaciones escalables
- **Prisma 7**: ORM moderno para Node.js y TypeScript
- **PostgreSQL 16**: Base de datos relacional
- **Docker & Docker Compose**: Containerización y orquestación
- **LocalStack**: Emulador de servicios AWS
- **TypeScript**: Lenguaje de programación tipado

## 📝 Notas Importantes

1. **Migraciones automáticas**: Las migraciones se ejecutan automáticamente al iniciar los contenedores. No necesitas ejecutar `prisma migrate` manualmente.

2. **Seeder idempotente**: El seeder SQL solo inserta productos si la tabla está vacía. Puedes ejecutar `docker-compose up` múltiples veces sin duplicar datos.

3. **Persistencia de datos**: Los datos se guardan en el volumen `postgres_data` de Docker. Para borrar todos los datos, usa `docker-compose down -v`.

4. **Prisma 7**: Este proyecto usa Prisma 7 con archivos `prisma.config.ts` para configuración. Los comandos de Prisma deben ejecutarse desde el directorio de cada servicio.

5. **Monorepo**: Ambos microservicios comparten las mismas dependencias (node_modules) pero tienen esquemas de base de datos independientes.


---

## 🏗️ Decisiones Técnicas Relevantes

### 1. Arquitectura de Microservicios con Separación de Responsabilidades

- **Products Service** y **Orders Service** como servicios independientes con responsabilidades claramente definidas
- **Database per Service**: Cada servicio tiene su propia base de datos (`products_db` y `orders_db`)
- Esquemas Prisma independientes con migraciones y cliente generado por servicio
- Aislamiento de dominios para escalabilidad y mantenibilidad independiente

### 2. Comunicación Híbrida: Síncrona + Event-Driven

**Comunicación Síncrona (HTTP/REST):**
- Validación de productos y stock desde Orders Service a Products Service vía HTTP
- `ProductsValidationService` implementa validaciones en paralelo usando `Promise.all` para mejor performance
- Fail-fast: validación de stock **antes** de crear la orden para garantizar consistencia

**Comunicación Asíncrona (SNS/SQS):**
- Eventos de dominio (`ORDER_CREATED`) publicados a SNS Topic
- SQS Queue para desacoplamiento y procesamiento eventual consistente
- Products Service consume eventos para decrementar stock de forma asíncrona
- `EventPublisherService` centralizado en librería compartida (`libs/events`)

### 3. Monorepo con Código Compartido

- Estructura NestJS con `apps/` (microservicios) y `libs/` (código compartido)
- **Shared libraries**:
  - `libs/commons`: DTOs de paginación y utilidades comunes
  - `libs/events`: Sistema de eventos completo (publisher, consumer, domain events)
- Reutilización de código sin duplicación entre servicios
- Dependencias compartidas centralizadas en el `package.json` raíz

### 4. Infraestructura Local con LocalStack

- Simulación completa de servicios AWS (SNS, SQS, API Gateway) sin costos de cloud
- Script `init-aws.sh` para inicialización automática de recursos AWS al arrancar
- API Gateway configurado como proxy único con rutas `/products` y `/orders`
- Datos persistentes de LocalStack en volumen para mantener configuración entre reinicios

### 5. Gestión de Datos y Migraciones Automatizadas

- **Prisma ORM** con generación de cliente personalizada por servicio
- Generadores configurados con output personalizado: `../src/generated/prisma`
- `entrypoint.sh` ejecuta migraciones automáticamente al iniciar contenedores
- Seeding automático e idempotente de productos desde SQL
- Prisma 7 con archivos `prisma.config.ts` para configuración moderna

### 6. CI/CD Pipeline Completo con Semantic Release

- **Conventional Commits** para mensajes de commit estandarizados
- **Semantic Release** para versionado automático (major, minor, patch)
- **GitHub Actions** con 3 workflows especializados:
  - **CI**: lint, test, build paralelo de servicios con cache de dependencias
  - **CD**: versionado semántico, generación de CHANGELOG, Docker build/push a GHCR, smoke tests
  - **Manual Release**: deploy controlado a diferentes ambientes con parámetros
- Artifacts para tracking de builds y reportes de cobertura
- Rollback automático si fallan los smoke tests en deploy

### 7. Docker Multi-stage Build Optimizado

- Build multi-etapa (builder + runtime) para imágenes ligeras en producción
- Build argument `APP_NAME` permite construir múltiples servicios desde el mismo Dockerfile
- Generación de Prisma Client durante la fase de build para evitar errores de tipado
- Alpine Linux para imagen base minimal
- Healthchecks configurados para todos los servicios con `depends_on` condicional

### 8. Persistencia y Resiliencia

- Docker volumes para PostgreSQL (`postgres_data`) mantienen datos entre reinicios
- LocalStack data persistente en `localstack_data` para configuración de infraestructura
- Healthchecks en `depends_on` garantizan orden de inicio correcto (DB → LocalStack → Services)
- Scripts de inicialización idempotentes para base de datos y AWS

### 9. Validaciones Robustas y Manejo de Errores

- Validación de stock **antes** de crear orden (fail-fast approach)
- Validaciones en paralelo para múltiples productos usando `Promise.all`
- Respuestas de error estructuradas con detalles múltiples y específicos
- `class-validator` y `class-transformer` para validación de DTOs en capa de API
- Logging detallado con NestJS Logger para debugging y monitoreo

### 10. Configuración Flexible y Portabilidad

- Variables de entorno para todos los endpoints y configuraciones
- `ConfigService` de NestJS para inyección de dependencias de configuración
- Mismas imágenes Docker funcionan en local, staging y production
- Endpoint AWS configurable (`AWS_ENDPOINT`) para cambiar entre LocalStack y AWS real
- Sin hardcodeo de valores, todo parametrizable por ambiente

### Principios de Diseño Aplicados

- **Separation of Concerns**: Cada servicio maneja su propio dominio
- **Database per Service**: Aislamiento de datos para independencia
- **Event-Driven Architecture**: Desacoplamiento temporal entre servicios
- **API Gateway Pattern**: Punto de entrada único para clientes
- **Fail Fast**: Validaciones tempranas para evitar estados inconsistentes
- **Infrastructure as Code**: Todo definido en docker-compose y scripts
- **DRY (Don't Repeat Yourself)**: Código compartido en libs
- **Convention over Configuration**: Conventional commits, Prisma conventions
- **Automation First**: Migraciones, seeding, CI/CD todo automatizado

---

## 🎯 Beneficios de estas Decisiones

1. **Developer Experience**: Hot reload, LocalStack, migraciones automáticas, monorepo
2. **Escalabilidad**: Microservicios independientes, bases de datos separadas
3. **Mantenibilidad**: Código compartido, conventional commits, versionado automático
4. **Confiabilidad**: Healthchecks, validaciones robustas, rollback automático
5. **Portabilidad**: Mismas imágenes en todos los ambientes, configuración flexible
6. **Observabilidad**: Logging estructurado, pipeline con artifacts y reportes
7. **Costo-eficiencia**: LocalStack para desarrollo sin gastos de AWS
8. **Production-ready**: CI/CD completo, Docker optimizado, pruebas automatizadas

## 📄 Licencia

Este proyecto es privado y confidencial.
