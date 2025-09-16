# 🍽️ CROSTY Software

**Software de Gestión Gastronómica para Alimentos Congelados al Vacío**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MazaSebastian/SoftwareCrosty)
[![GitHub Actions](https://github.com/MazaSebastian/SoftwareCrosty/workflows/CI/CD/badge.svg)](https://github.com/MazaSebastian/SoftwareCrosty/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Descripción

CROSTY Software es una aplicación de escritorio desarrollada con **Electron + React** para la gestión integral de negocios de alimentos congelados al vacío. Incluye control de caja diaria, gestión de insumos, cálculo de recetas, ventas y reportes.

## ✨ Características

### 🏠 Dashboard
- Vista general del negocio
- Estadísticas en tiempo real
- Acceso rápido a funciones principales

### 💰 Caja Diaria
- Control de ingresos y egresos diarios
- Saldos individuales por socio
- Registro de movimientos en efectivo y transferencia
- Historial completo de transacciones

### 🥬 Gestión de Insumos
- Control de ingredientes y materias primas
- Seguimiento de precios y fluctuaciones
- Historial de precios por insumo
- Cálculo de costos por unidad

### 🍽️ Cálculo de Recetas
- Creación y edición de recetas
- Cálculo automático de costos por receta
- Control de rendimientos
- Costo por porción individual

### 📦 Control de Stock
- Gestión de stock de productos terminados
- Registro de movimientos de inventario
- Alertas de stock bajo
- Estadísticas de rotación

### 🛒 Sistema de Ventas
- Registro de ventas diarias
- Control por método de pago (efectivo/transferencia)
- Estadísticas de ventas (día/semana/mes)
- Historial completo de transacciones

### 📊 Reportes
- Reportes de ventas detallados
- Análisis de caja diaria
- Reportes de insumos y costos
- Exportación de datos

## 🚀 Tecnologías

- **Frontend:** React 18 + Styled Components
- **Desktop:** Electron 27
- **Estado:** React Context API
- **Despliegue:** Vercel + GitHub Actions
- **Control de Versiones:** Git + GitHub

## 🎨 Diseño

- **Paleta de colores:** Beige (#F5F5DC), Bordo oscuro (#722F37), Gris (#6B7280)
- **Interfaz:** Elegante y profesional
- **Responsive:** Adaptable a diferentes tamaños de pantalla
- **UX:** Navegación intuitiva y fácil de usar

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Git

### Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/MazaSebastian/SoftwareCrosty.git
cd SoftwareCrosty

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run electron-dev

# O solo React (para web)
npm start
```

### Producción

```bash
# Crear build de producción
npm run build

# Crear ejecutable de Electron
npm run electron-pack
```

## 🌐 Despliegue

### Vercel (Web)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TU_USUARIO/crosty-software)

### GitHub Actions
El proyecto incluye CI/CD automático que:
- Ejecuta tests en cada push
- Despliega automáticamente a Vercel
- Crea releases para Electron

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start                 # React en modo desarrollo
npm run electron-dev      # Electron + React en desarrollo
npm test                  # Ejecutar tests

# Producción
npm run build            # Build de React
npm run electron-pack    # Build de Electron
npm run deploy           # Deploy completo

# Utilidades
npm run lint             # Linter
npm run format           # Formatear código
```

## 📁 Estructura del Proyecto

```
crosty-software/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   └── Sidebar.jsx
│   ├── pages/          # Páginas principales
│   │   ├── Dashboard.jsx
│   │   ├── CajaDiaria.jsx
│   │   ├── Insumos.jsx
│   │   ├── Recetas.jsx
│   │   ├── Stock.jsx
│   │   ├── Ventas.jsx
│   │   ├── Reportes.jsx
│   │   └── Configuracion.jsx
│   ├── services/       # Lógica de negocio
│   │   ├── cajaService.js
│   │   ├── insumosService.js
│   │   ├── recetasService.js
│   │   ├── ventasService.js
│   │   ├── stockService.js
│   │   └── reportesService.js
│   ├── context/        # Estado global
│   │   └── AppContext.js
│   ├── App.js          # Componente principal
│   └── index.js        # Punto de entrada
├── public/             # Archivos estáticos
├── .github/            # GitHub Actions
├── vercel.json         # Configuración de Vercel
└── package.json        # Dependencias
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

- **Issues:** [GitHub Issues](https://github.com/MazaSebastian/SoftwareCrosty/issues)
- **Discussions:** [GitHub Discussions](https://github.com/MazaSebastian/SoftwareCrosty/discussions)
- **Email:** soporte@crosty.com

## 🎯 Roadmap

- [ ] Sistema de backup automático
- [ ] Notificaciones push
- [ ] Gráficos avanzados
- [ ] Exportación a Excel/PDF
- [ ] Sincronización en la nube
- [ ] App móvil
- [ ] Sistema de usuarios
- [ ] API REST

## 🙏 Agradecimientos

- React Team por el framework
- Electron Team por la plataforma de escritorio
- Vercel por el hosting
- GitHub por el control de versiones

---

**Desarrollado con ❤️ para CROSTY - Alimentos Congelados al Vacío**

*Última actualización: $(date)*

[![GitHub stars](https://img.shields.io/github/stars/MazaSebastian/SoftwareCrosty?style=social)](https://github.com/MazaSebastian/SoftwareCrosty/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/MazaSebastian/SoftwareCrosty?style=social)](https://github.com/MazaSebastian/SoftwareCrosty/network)