# CROSTY - Software de Gestión Gastronómica

Software de escritorio para la gestión integral de tu emprendimiento gastronómico CROSTY.

## 🚀 Características

- **Dashboard Principal**: Vista general de tu negocio
- **Gestión de Gastos**: Control completo de gastos operativos
- **CROSTI**: Módulo especializado para tu marca
- **Inventario**: Control de stock y productos
- **Reportes**: Análisis y estadísticas
- **Configuración**: Personalización del sistema

## 🛠️ Tecnologías

- **Electron**: Framework para aplicaciones de escritorio
- **React**: Biblioteca de interfaz de usuario
- **GitHub**: Control de versiones
- **Vercel**: Deployment y control de versiones

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd crosty-gastronomia
```

2. Instala las dependencias:
```bash
npm install
```

## 🚀 Desarrollo

Para ejecutar en modo desarrollo:
```bash
npm run electron-dev
```

Para construir la aplicación:
```bash
npm run electron-pack
```

## 📁 Estructura del Proyecto

```
crosty-gastronomia/
├── public/
│   ├── electron.js          # Configuración de Electron
│   ├── index.html           # HTML principal
│   └── manifest.json        # Manifest de la app
├── src/
│   ├── App.js              # Componente principal
│   ├── App.css             # Estilos principales
│   ├── index.js            # Punto de entrada
│   └── index.css           # Estilos globales
├── package.json            # Configuración del proyecto
└── README.md              # Este archivo
```

## 🔧 Scripts Disponibles

- `npm start`: Inicia la aplicación React
- `npm run electron`: Ejecuta Electron
- `npm run electron-dev`: Ejecuta en modo desarrollo
- `npm run build`: Construye la aplicación
- `npm run electron-pack`: Empaqueta la aplicación

## 📝 Notas de Desarrollo

- El proyecto está configurado para desarrollo con hot-reload
- Las secciones están separadas para facilitar el mantenimiento
- Se utiliza un diseño responsivo y moderno
- Los estilos siguen un patrón de gradientes consistente

## 🎯 Próximos Pasos

1. Configurar base de datos local
2. Implementar autenticación
3. Desarrollar módulos específicos
4. Configurar deployment automático

---

Desarrollado para CROSTY 🍕
