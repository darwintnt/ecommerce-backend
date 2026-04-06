# 🚀 Próximos Pasos - Activar CI/CD Pipeline

Este archivo contiene las instrucciones para activar el pipeline CI/CD recién implementado.

## ✅ Lo que se ha implementado

1. **Configuración de Semantic Release**
   - `.releaserc.json` - Configuración de versionado automático
   - `.commitlintrc.json` - Validación de conventional commits
   - Scripts agregados a `package.json`

2. **Workflows de GitHub Actions**
   - `.github/workflows/ci.yml` - Integración continua (lint, test, build)
   - `.github/workflows/cd.yml` - Despliegue continuo (version, docker, deploy)
   - `.github/workflows/release.yml` - Release manual

3. **Extras**
   - `.github/dependabot.yml` - Actualizaciones automáticas de dependencias
   - `CHANGELOG.md` - Archivo de changelog inicial
   - README actualizado con badges y documentación CI/CD

## 📋 Pasos para Activar el Pipeline

### 1. Instalar dependencias de semantic-release

Desde el directorio `ecommerce-backend/`:

```bash
cd ecommerce-backend
pnpm add -D semantic-release \
  @semantic-release/commit-analyzer \
  @semantic-release/release-notes-generator \
  @semantic-release/changelog \
  @semantic-release/npm \
  @semantic-release/git \
  @semantic-release/github \
  conventional-changelog-conventionalcommits \
  @commitlint/cli \
  @commitlint/config-conventional
```

### 2. Verificar que los archivos se crearon correctamente

```bash
# Desde la raíz del proyecto
ls -la .github/workflows/
# Deberías ver: ci.yml, cd.yml, release.yml

ls -la ecommerce-backend/
# Deberías ver: .releaserc.json, .commitlintrc.json, CHANGELOG.md

ls -la .github/
# Deberías ver: dependabot.yml
```

### 3. Actualizar badges en README

Edita `README.md` y reemplaza `USUARIO/REPO` con tu información de GitHub:

```markdown
[![CI](https://github.com/TU_USUARIO/TU_REPO/actions/workflows/ci.yml/badge.svg)]...
[![CD](https://github.com/TU_USUARIO/TU_REPO/actions/workflows/cd.yml/badge.svg)]...
[![Release](https://img.shields.io/github/v/release/TU_USUARIO/TU_REPO?label=version)]...
```

### 4. Hacer commit inicial con conventional commits

```bash
# Agregar todos los archivos nuevos
git add .

# Hacer commit usando conventional commits
git commit -m "feat: implement CI/CD pipeline with GitHub Actions

- Add semantic-release configuration
- Add GitHub Actions workflows (CI, CD, Manual Release)
- Add conventional commits validation
- Add Dependabot for dependency updates
- Update README with CI/CD documentation
- Add initial CHANGELOG.md

BREAKING CHANGE: this is the first release with automated versioning"

# Push a tu repositorio
git push origin main
```

### 5. Verificar que el pipeline se ejecuta

1. Ve a tu repositorio en GitHub
2. Click en la pestaña "Actions"
3. Deberías ver el workflow "CI - Continuous Integration" ejecutándose
4. Después del CI, el workflow "CD - Continuous Deployment" iniciará automáticamente

### 6. Verificar la primera release

Después de que el CD termine:

1. Ve a la pestaña "Releases" en GitHub
2. Deberías ver una nueva release (probablemente `v1.0.0`)
3. El `CHANGELOG.md` debería actualizarse automáticamente
4. El `package.json` debería tener la nueva versión

## 🧪 Probar el Workflow de CI en Pull Request

```bash
# Crear una rama de prueba
git checkout -b test/ci-pipeline

# Hacer un cambio pequeño
echo "# Test CI" >> TEST.md
git add TEST.md
git commit -m "test: verify CI pipeline works on pull requests"

# Push de la rama
git push origin test/ci-pipeline

# En GitHub:
# 1. Crea un Pull Request de test/ci-pipeline → main
# 2. Verás que el CI workflow se ejecuta automáticamente
# 3. El PR no se puede mergear hasta que el CI pase
```

## 🔄 Flujo de Trabajo Normal

### Para nuevas features:

```bash
git checkout -b feature/nueva-funcionalidad
# Haz cambios...
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
# Crea PR en GitHub → CI corre automáticamente
```

### Para bug fixes:

```bash
git checkout -b fix/corregir-bug
# Haz cambios...
git add .
git commit -m "fix: corregir problema en validación"
git push origin fix/corregir-bug
# Crea PR en GitHub → CI corre automáticamente
```

### Después de merge a main:

- CD workflow ejecuta automáticamente
- Semantic release determina nueva versión
- CHANGELOG se actualiza
- GitHub release se crea
- Imágenes Docker se construyen
- Deploy simulation se ejecuta

## 🎯 Ejecutar Release Manual

1. Ve a "Actions" en GitHub
2. Selecciona "Manual Release" en la lista de workflows
3. Click en "Run workflow"
4. Selecciona:
   - Environment: `localstack`
   - Version tag: `latest` (o una versión específica)
   - Run tests: `true`
5. Click en "Run workflow"

## 🐛 Troubleshooting

### El CI falla con "pnpm: command not found"

Verifica que la versión de pnpm en los workflows coincida con tu versión local:

```bash
pnpm --version
# Actualiza PNPM_VERSION en los archivos .yml si es necesario
```

### Semantic release no crea una nueva versión

Asegúrate de que tus commits sigan el formato conventional commits:

```bash
# Correcto ✅
git commit -m "feat: agregar validación"
git commit -m "fix: corregir bug en API"

# Incorrecto ❌
git commit -m "agregando validación"
git commit -m "bug fix"
```

### El workflow de CD no se ejecuta después del CI

Verifica que:

1. Estás en la rama `main`
2. El CI pasó exitosamente
3. Los commits usan conventional commits format

### Error "GITHUB_TOKEN permissions"

Si obtienes errores de permisos, verifica:

1. Ve a Settings → Actions → General
2. En "Workflow permissions", selecciona "Read and write permissions"
3. Marca "Allow GitHub Actions to create and approve pull requests"

## 📊 Verificar Estado del Pipeline

```bash
# Usando GitHub CLI
gh workflow list
gh run list --limit 5
gh run view <run-id>

# Ver logs en tiempo real
gh run watch

# Ver artefactos generados
gh run view <run-id> --log-failed
```

## 🔐 Configurar Secrets (Opcional)

Para push de imágenes Docker a registries externos:

1. Ve a Settings → Secrets and variables → Actions
2. Agrega secrets:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - Otros según necesidad

## 🎉 ¡Listo!

El pipeline CI/CD está completamente configurado. Cualquier push a `main` o PR generará automáticamente builds, tests y releases.

Para más información, consulta la sección "CI/CD Pipeline" en el README.md
