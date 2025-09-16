# 🚀 Configuración de GitHub para CROSTY Software

## 📋 Pasos para Configurar GitHub

### 1. Crear Repositorio en GitHub
1. Ve a [GitHub.com](https://github.com)
2. Haz clic en "New repository"
3. Nombre: `crosty-software`
4. Descripción: `🍽️ CROSTY - Software de Gestión Gastronómica para Alimentos Congelados al Vacío`
5. Marca como **Público**
6. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)
7. Haz clic en "Create repository"

### 2. Conectar Repositorio Local
```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/crosty-software.git

# Subir el código
git branch -M main
git push -u origin main
```

### 3. Configurar Vercel
1. Ve a [Vercel.com](https://vercel.com)
2. Haz clic en "Import Project"
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `crosty-software`
5. Vercel detectará automáticamente que es un proyecto React
6. Haz clic en "Deploy"

## 🔄 Flujo de Trabajo

### Desarrollo en Tiempo Real
```bash
# Hacer cambios en el código
git add .
git commit -m "✨ Nueva funcionalidad: [descripción]"
git push origin main
```

### Vercel se actualiza automáticamente
- Cada push a `main` desplegará automáticamente
- URL de desarrollo: `https://crosty-software.vercel.app`
- Preview de PRs: `https://crosty-software-git-[branch].vercel.app`

## 📁 Estructura del Proyecto
```
crosty-software/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas principales
│   ├── services/      # Lógica de negocio
│   ├── context/       # Estado global
│   └── utils/         # Utilidades
├── public/            # Archivos estáticos
├── .github/           # GitHub Actions
├── vercel.json        # Configuración de Vercel
└── package.json       # Dependencias
```

## 🎯 Beneficios del Flujo GitHub + Vercel

### ✅ Control de Versiones
- Historial completo de cambios
- Branches para features
- Pull requests para revisión
- Tags para releases

### ✅ Despliegue Automático
- Deploy en cada push
- Preview de branches
- Rollback fácil
- URLs estables

### ✅ Colaboración
- Issues para bugs
- Projects para planificación
- Wiki para documentación
- Discussions para ideas

### ✅ Monitoreo
- Analytics de Vercel
- Logs de errores
- Performance metrics
- Uptime monitoring

## 🔧 Comandos Útiles

### Git Básico
```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit con mensaje
git commit -m "✨ Nueva funcionalidad"

# Push a GitHub
git push origin main

# Crear branch
git checkout -b feature/nueva-funcionalidad

# Merge branch
git checkout main
git merge feature/nueva-funcionalidad
```

### Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy manual
vercel

# Deploy a producción
vercel --prod
```

## 📱 URLs del Proyecto

- **GitHub:** `https://github.com/TU_USUARIO/crosty-software`
- **Vercel:** `https://crosty-software.vercel.app`
- **Issues:** `https://github.com/TU_USUARIO/crosty-software/issues`
- **Actions:** `https://github.com/TU_USUARIO/crosty-software/actions`

## 🚀 Próximos Pasos

1. ✅ Crear repositorio en GitHub
2. ✅ Conectar repositorio local
3. ✅ Configurar Vercel
4. ✅ Probar despliegue automático
5. ✅ Configurar branches de desarrollo
6. ✅ Implementar CI/CD
7. ✅ Configurar monitoreo

---
**¡Listo para desarrollo en tiempo real con GitHub + Vercel!** 🎉
