# 🚀 Instrucciones de Despliegue - CROSTY Software

## 📋 Resumen
Este documento contiene las instrucciones completas para desplegar el software CROSTY a producción.

## 🎯 Opciones de Despliegue

### 1. 📱 Aplicación de Escritorio (Electron)
**Recomendado para uso local en tu negocio**

#### Archivos Generados:
- `CROSTY Gestión Gastronómica-1.0.0-arm64.dmg` - Instalador para macOS (Apple Silicon)
- `CROSTY Gestión Gastronómica-1.0.0-arm64-mac.zip` - Aplicación portable para macOS

#### Instalación:
```bash
# Opción 1: Instalación automática
./instalar-crosty.sh

# Opción 2: Instalación manual
# 1. Descarga el archivo .dmg
# 2. Haz doble clic para montar
# 3. Arrastra la app a Aplicaciones
# 4. Ejecuta desde Launchpad
```

### 2. 🌐 Aplicación Web (Vercel)
**Para acceso desde cualquier dispositivo**

#### Despliegue en Vercel:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod

# O conectar con GitHub para despliegue automático
```

#### URL de Producción:
- **Desarrollo:** `https://crosty-gastronomia.vercel.app`
- **Producción:** `https://crosty-gastronomia.vercel.app`

### 3. 📦 GitHub Releases
**Para distribución y versionado**

#### Crear Release:
```bash
# Crear tag de versión
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions creará automáticamente el release
```

## 🔧 Comandos de Producción

### Build Completo:
```bash
./deploy.sh
```

### Build Manual:
```bash
# Instalar dependencias
npm ci

# Crear build de React
npm run build

# Crear ejecutable de Electron
npm run electron-pack
```

### Verificar Instalación:
```bash
# Verificar archivos generados
ls -la dist/

# Verificar checksums
cd dist/
shasum -c *.sha256
```

## 📁 Estructura de Archivos de Producción

```
dist/
├── CROSTY Gestión Gastronómica-1.0.0-arm64.dmg
├── CROSTY Gestión Gastronómica-1.0.0-arm64.dmg.sha256
├── CROSTY Gestión Gastronómica-1.0.0-arm64-mac.zip
├── CROSTY Gestión Gastronómica-1.0.0-arm64-mac.zip.sha256
└── mac-arm64/
    └── CROSTY Gestión Gastronómica.app/
```

## 🔒 Seguridad y Backup

### Datos Locales:
- Los datos se almacenan en el sistema local
- Ubicación: `~/Library/Application Support/CROSTY Gestión Gastronómica/`
- **Importante:** Hacer backup regular de esta carpeta

### Configuración de Backup:
```bash
# Crear backup manual
cp -r ~/Library/Application\ Support/CROSTY\ Gestión\ Gastronómica/ ~/Desktop/backup-crosty-$(date +%Y%m%d)
```

## 🚨 Solución de Problemas

### Error: "Aplicación dañada"
```bash
# Permitir aplicaciones de desarrolladores
sudo xattr -rd com.apple.quarantine "/Applications/CROSTY Gestión Gastronómica.app"
```

### Error: "No se puede abrir"
```bash
# Verificar permisos
chmod +x "/Applications/CROSTY Gestión Gastronómica.app/Contents/MacOS/CROSTY Gestión Gastronómica"
```

### Error de Build:
```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Soporte

### Información de Contacto:
- **Email:** soporte@crosty.com
- **Documentación:** README-PRODUCCION.md
- **Versión:** 1.0.0

### Logs de Error:
- **Ubicación:** `~/Library/Logs/CROSTY Gestión Gastronómica/`
- **Archivo:** `main.log`

## 🔄 Actualizaciones

### Proceso de Actualización:
1. Descargar nueva versión
2. Hacer backup de datos actuales
3. Instalar nueva versión
4. Restaurar datos si es necesario

### Verificación de Versión:
- Abrir la aplicación
- Ir a "Acerca de" en el menú
- Verificar número de versión

---
**Última actualización:** Diciembre 2024  
**Versión del documento:** 1.0.0
