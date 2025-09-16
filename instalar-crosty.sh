#!/bin/bash

# Script de instalación para CROSTY Software
echo "🍽️ Instalando CROSTY - Software de Gestión Gastronómica"
echo "=================================================="

# Verificar si estamos en macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Este software está diseñado para macOS"
    exit 1
fi

# Verificar arquitectura
ARCH=$(uname -m)
echo "📱 Arquitectura detectada: $ARCH"

# Crear directorio de aplicaciones si no existe
APP_DIR="$HOME/Applications"
if [ ! -d "$APP_DIR" ]; then
    mkdir -p "$APP_DIR"
    echo "📁 Directorio de aplicaciones creado: $APP_DIR"
fi

# Función para instalar desde DMG
install_from_dmg() {
    local dmg_file="$1"
    local app_name="$2"
    
    if [ -f "$dmg_file" ]; then
        echo "📦 Instalando desde DMG: $dmg_file"
        
        # Montar DMG
        hdiutil attach "$dmg_file" -quiet
        
        # Copiar aplicación
        cp -R "/Volumes/$app_name/$app_name.app" "$APP_DIR/"
        
        # Desmontar DMG
        hdiutil detach "/Volumes/$app_name" -quiet
        
        echo "✅ Instalación completada en: $APP_DIR/$app_name.app"
        return 0
    else
        echo "❌ Archivo DMG no encontrado: $dmg_file"
        return 1
    fi
}

# Función para instalar desde ZIP
install_from_zip() {
    local zip_file="$1"
    local app_name="$2"
    
    if [ -f "$zip_file" ]; then
        echo "📦 Instalando desde ZIP: $zip_file"
        
        # Crear directorio temporal
        TEMP_DIR=$(mktemp -d)
        
        # Descomprimir ZIP
        unzip -q "$zip_file" -d "$TEMP_DIR"
        
        # Copiar aplicación
        cp -R "$TEMP_DIR/$app_name.app" "$APP_DIR/"
        
        # Limpiar directorio temporal
        rm -rf "$TEMP_DIR"
        
        echo "✅ Instalación completada en: $APP_DIR/$app_name.app"
        return 0
    else
        echo "❌ Archivo ZIP no encontrado: $zip_file"
        return 1
    fi
}

# Buscar archivos de instalación
DMG_FILE=""
ZIP_FILE=""

# Buscar en el directorio actual
for file in *.dmg; do
    if [ -f "$file" ]; then
        DMG_FILE="$file"
        break
    fi
done

for file in *.zip; do
    if [ -f "$file" ]; then
        ZIP_FILE="$file"
        break
    fi
done

# Intentar instalación
if [ -n "$DMG_FILE" ]; then
    install_from_dmg "$DMG_FILE" "CROSTY Gestión Gastronómica"
elif [ -n "$ZIP_FILE" ]; then
    install_from_zip "$ZIP_FILE" "CROSTY Gestión Gastronómica"
else
    echo "❌ No se encontraron archivos de instalación (.dmg o .zip)"
    echo "📁 Archivos disponibles en el directorio:"
    ls -la *.dmg *.zip 2>/dev/null || echo "   No hay archivos de instalación"
    exit 1
fi

# Verificar instalación
if [ -d "$APP_DIR/CROSTY Gestión Gastronómica.app" ]; then
    echo ""
    echo "🎉 ¡Instalación exitosa!"
    echo "📱 La aplicación está disponible en: $APP_DIR/CROSTY Gestión Gastronómica.app"
    echo "🚀 Puedes ejecutarla desde Launchpad o Finder"
    echo ""
    echo "¿Deseas abrir la aplicación ahora? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        open "$APP_DIR/CROSTY Gestión Gastronómica.app"
    fi
else
    echo "❌ Error en la instalación"
    exit 1
fi
