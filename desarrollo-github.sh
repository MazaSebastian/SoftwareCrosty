#!/bin/bash

# Script de desarrollo con GitHub + Vercel para CROSTY Software
echo "🚀 CROSTY Software - Desarrollo con GitHub + Vercel"
echo "=================================================="

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Ejecuta desde el directorio raíz."
    exit 1
fi

# Función para mostrar opciones
show_menu() {
    echo ""
    echo " ¿Qué quieres hacer?"
    echo "1. 🔄 Desarrollo local (npm start)"
    echo "2. 📦 Crear build de producción"
    echo "3. 📤 Subir cambios a GitHub"
    echo "4. 🚀 Deploy a Vercel"
    echo "5. 📊 Ver estado del repositorio"
    echo "6. 🔍 Ver logs de Vercel"
    echo "7. 🧪 Ejecutar tests"
    echo "8. 📋 Ver estadísticas del proyecto"
    echo "9. 🚪 Salir"
    echo ""
    read -p "Selecciona una opción (1-9): " choice
}

# Función para desarrollo local
start_development() {
    print_status "Iniciando desarrollo local..."
    print_warning "Los cambios se aplicarán en tiempo real"
    print_status "Presiona Ctrl+C para detener"
    echo ""
    
    npm start
}

# Función para build de producción
build_production() {
    print_status "Creando build de producción..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Build completado exitosamente!"
        print_status "Archivos disponibles en: ./build/"
        
        # Mostrar tamaño del build
        BUILD_SIZE=$(du -sh build/ | cut -f1)
        print_status "Tamaño del build: $BUILD_SIZE"
    else
        print_error "Error en el build. Revisa los logs."
    fi
}

# Función para subir cambios a GitHub
push_to_github() {
    print_status "Preparando cambios para GitHub..."
    
    # Verificar si hay cambios
    if [ -z "$(git status --porcelain)" ]; then
        print_warning "No hay cambios para subir"
        return
    fi
    
    # Mostrar cambios
    echo ""
    print_status "Cambios detectados:"
    git status --short
    
    echo ""
    read -p "¿Deseas continuar con el commit? (y/n): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        print_warning "Operación cancelada"
        return
    fi
    
    # Agregar archivos
    git add .
    
    # Solicitar mensaje de commit
    echo ""
    read -p "Mensaje de commit: " commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="✨ Actualización automática"
    fi
    
    # Commit y push
    git commit -m "$commit_message"
    git push origin main
    
    if [ $? -eq 0 ]; then
        print_success "Cambios subidos a GitHub exitosamente!"
        print_status "Vercel desplegará automáticamente en unos minutos"
    else
        print_error "Error subiendo cambios a GitHub"
    fi
}

# Función para deploy a Vercel
deploy_vercel() {
    print_status "Desplegando a Vercel..."
    
    # Verificar si Vercel CLI está instalado
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI no está instalado"
        read -p "¿Deseas instalarlo? (y/n): " install_vercel
        if [[ "$install_vercel" =~ ^[Yy]$ ]]; then
            npm i -g vercel
        else
            print_warning "Skipping deploy a Vercel"
            return
        fi
    fi
    
    # Deploy
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Deploy a Vercel completado!"
    else
        print_error "Error en deploy a Vercel"
    fi
}

# Función para ver estado del repositorio
show_repo_status() {
    print_status "Estado del repositorio:"
    echo ""
    
    # Estado de Git
    echo "📁 Archivos modificados:"
    git status --short
    
    echo ""
    echo "📊 Estadísticas:"
    echo "  - Commits: $(git rev-list --count HEAD)"
    echo "  - Último commit: $(git log -1 --format='%h - %s (%cr)')"
    echo "  - Branch actual: $(git branch --show-current)"
    
    echo ""
    echo "🌐 Remotes:"
    git remote -v
    
    echo ""
    echo "📈 Últimos commits:"
    git log --oneline -5
}

# Función para ver logs de Vercel
show_vercel_logs() {
    print_status "Obteniendo logs de Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI no está instalado"
        return
    fi
    
    vercel logs
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
    du -sh build/ 2>/dev/null | xargs echo "  - Build de producción:" || echo "  - Build de producción: No disponible"
    
    echo ""
    echo "🔧 Dependencias:"
    npm list --depth=0 2>/dev/null | grep -E "├|└" | wc -l | xargs echo "  - Paquetes instalados:"
    
    echo ""
    echo "📈 Git:"
    echo "  - Commits: $(git rev-list --count HEAD)"
    echo "  - Archivos: $(git ls-files | wc -l)"
    echo "  - Líneas de código: $(git ls-files | xargs wc -l | tail -1 | awk '{print $1}')"
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
            push_to_github
            ;;
        4)
            deploy_vercel
            ;;
        5)
            show_repo_status
            ;;
        6)
            show_vercel_logs
            ;;
        7)
            run_tests
            ;;
        8)
            show_stats
            ;;
        9)
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
