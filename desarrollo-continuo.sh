#!/bin/bash

# Script para desarrollo continuo de CROSTY Software
echo "🔄 Iniciando modo de desarrollo continuo"
echo "======================================"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json. Ejecuta desde el directorio raíz."
    exit 1
fi

# Función para mostrar opciones
show_menu() {
    echo ""
    echo " ¿Qué quieres hacer?"
    echo "1. 🚀 Iniciar desarrollo (cambios en tiempo real)"
    echo "2. 📦 Crear build de producción"
    echo "3. 🔄 Actualizar aplicación instalada"
    echo "4. 🧪 Ejecutar tests"
    echo "5. 📊 Ver estadísticas del proyecto"
    echo "6. 🚪 Salir"
    echo ""
    read -p "Selecciona una opción (1-6): " choice
}

# Función para desarrollo
start_development() {
    print_status "Iniciando modo desarrollo..."
    print_warning "Los cambios se aplicarán en tiempo real"
    print_status "Presiona Ctrl+C para detener"
    echo ""
    
    npm run electron-dev
}

# Función para build de producción
build_production() {
    print_status "Creando build de producción..."
    npm run electron-pack
    
    if [ $? -eq 0 ]; then
        print_success "Build completado exitosamente!"
        print_status "Archivos disponibles en: ./dist/"
        
        echo ""
        echo "¿Deseas instalar la nueva versión? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            ./instalar-crosty.sh
        fi
    else
        print_warning "Error en el build. Revisa los logs."
    fi
}

# Función para actualizar aplicación
update_app() {
    print_status "Actualizando aplicación instalada..."
    
    if [ -d "$HOME/Applications/CROSTY Gestión Gastronómica.app" ]; then
        print_status "Aplicación encontrada. Actualizando..."
        ./instalar-crosty.sh
    else
        print_warning "No se encontró la aplicación instalada."
        print_status "Ejecutando instalación inicial..."
        ./instalar-crosty.sh
    fi
}

# Función para tests
run_tests() {
    print_status "Ejecutando tests..."
    npm test -- --watchAll=false --passWithNoTests
}

# Función para estadísticas
show_stats() {
    print_status "Estadísticas del proyecto:"
    echo ""
    
    # Contar archivos
    echo "📁 Archivos del proyecto:"
    find src -name "*.js" -o -name "*.jsx" | wc -l | xargs echo "  - Componentes:"
    find src/services -name "*.js" | wc -l | xargs echo "  - Servicios:"
    find src/pages -name "*.jsx" | wc -l | xargs echo "  - Páginas:"
    
    echo ""
    echo "📊 Tamaño del proyecto:"
    du -sh . | xargs echo "  - Tamaño total:"
    du -sh dist/ 2>/dev/null | xargs echo "  - Build de producción:" || echo "  - Build de producción: No disponible"
    
    echo ""
    echo "🔧 Dependencias:"
    npm list --depth=0 2>/dev/null | grep -E "├|└" | wc -l | xargs echo "  - Paquetes instalados:"
}

# Loop principal
while true; do
    show_menu
    
    case $choice in
        1)
            start_development
            ;;
        2)
            build_production
            ;;
        3)
            update_app
            ;;
        4)
            run_tests
            ;;
        5)
            show_stats
            ;;
        6)
            print_success "¡Hasta luego! 👋"
            exit 0
            ;;
        *)
            print_warning "Opción inválida. Intenta de nuevo."
            ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
done