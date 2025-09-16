#!/bin/bash

# Script de despliegue para CROSTY Software
echo "🚀 Desplegando CROSTY Software a Producción"
echo "=========================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con color
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Ejecuta este script desde el directorio raíz del proyecto."
    exit 1
fi

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado. Por favor instala npm primero."
    exit 1
fi

print_status "Verificando dependencias..."
npm ci

print_status "Ejecutando tests..."
npm test -- --watchAll=false --passWithNoTests

print_status "Creando build de producción..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Error en el build de producción"
    exit 1
fi

print_status "Creando ejecutable de Electron..."
npm run electron-pack

if [ $? -ne 0 ]; then
    print_error "Error al crear el ejecutable de Electron"
    exit 1
fi

print_success "Build completado exitosamente!"

# Verificar que los archivos se crearon
if [ -d "dist" ]; then
    print_status "Archivos de distribución creados:"
    ls -la dist/
else
    print_error "No se encontró el directorio dist/"
    exit 1
fi

# Crear archivo de versión
echo "1.0.0" > VERSION
print_status "Archivo de versión creado"

# Crear checksum de los archivos
print_status "Generando checksums..."
cd dist
for file in *.dmg *.zip; do
    if [ -f "$file" ]; then
        shasum -a 256 "$file" > "${file}.sha256"
        print_status "Checksum creado para: $file"
    fi
done
cd ..

print_success "¡Despliegue completado exitosamente!"
echo ""
echo "📁 Archivos de distribución disponibles en: ./dist/"
echo "📱 Para instalar en macOS, usa: ./instalar-crosty.sh"
echo "🌐 Para desplegar en Vercel, ejecuta: vercel --prod"
echo ""

# Preguntar si desea abrir el directorio dist
echo "¿Deseas abrir el directorio de distribución? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    open dist/
fi
