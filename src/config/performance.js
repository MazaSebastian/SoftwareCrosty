// Configuración de performance para CROSTY Software

export const PERFORMANCE_CONFIG = {
  // Configuración de caché
  CACHE: {
    // Tiempo de vida del caché en milisegundos
    DEFAULT_CACHE_TIME: 5 * 60 * 1000, // 5 minutos
    DEFAULT_STALE_TIME: 2 * 60 * 1000, // 2 minutos
    
    // Configuraciones específicas por módulo
    VENTAS: {
      CACHE_TIME: 2 * 60 * 1000, // 2 minutos
      STALE_TIME: 30 * 1000 // 30 segundos
    },
    CAJA: {
      CACHE_TIME: 1 * 60 * 1000, // 1 minuto
      STALE_TIME: 15 * 1000 // 15 segundos
    },
    INSUMOS: {
      CACHE_TIME: 10 * 60 * 1000, // 10 minutos
      STALE_TIME: 5 * 60 * 1000 // 5 minutos
    },
    RECETAS: {
      CACHE_TIME: 15 * 60 * 1000, // 15 minutos
      STALE_TIME: 10 * 60 * 1000 // 10 minutos
    },
    STOCK: {
      CACHE_TIME: 5 * 60 * 1000, // 5 minutos
      STALE_TIME: 2 * 60 * 1000 // 2 minutos
    },
    REPORTES: {
      CACHE_TIME: 10 * 60 * 1000, // 10 minutos
      STALE_TIME: 5 * 60 * 1000 // 5 minutos
    }
  },

  // Configuración de lazy loading
  LAZY_LOADING: {
    // Tiempo de espera antes de cargar componentes
    LOADING_DELAY: 100, // 100ms
    // Tiempo de timeout para carga de componentes
    LOADING_TIMEOUT: 10000 // 10 segundos
  },

  // Configuración de debounce
  DEBOUNCE: {
    // Tiempo de debounce para búsquedas
    SEARCH: 300, // 300ms
    // Tiempo de debounce para filtros
    FILTERS: 500, // 500ms
    // Tiempo de debounce para formularios
    FORMS: 1000 // 1 segundo
  },

  // Configuración de throttle
  THROTTLE: {
    // Tiempo de throttle para scroll
    SCROLL: 100, // 100ms
    // Tiempo de throttle para resize
    RESIZE: 250, // 250ms
    // Tiempo de throttle para eventos de mouse
    MOUSE: 50 // 50ms
  },

  // Configuración de paginación
  PAGINATION: {
    // Tamaño de página por defecto
    DEFAULT_PAGE_SIZE: 20,
    // Tamaños de página disponibles
    PAGE_SIZES: [10, 20, 50, 100],
    // Máximo número de páginas a mostrar
    MAX_PAGES: 10
  },

  // Configuración de gráficos
  CHARTS: {
    // Tiempo de animación de gráficos
    ANIMATION_DURATION: 1000, // 1 segundo
    // Tiempo de actualización de gráficos
    UPDATE_INTERVAL: 30 * 1000, // 30 segundos
    // Número máximo de puntos en gráficos de líneas
    MAX_LINE_POINTS: 100,
    // Número máximo de elementos en gráficos de barras
    MAX_BAR_ITEMS: 20
  },

  // Configuración de notificaciones
  NOTIFICATIONS: {
    // Tiempo de duración de notificaciones
    DURATION: 5000, // 5 segundos
    // Tiempo de delay para notificaciones
    DELAY: 100 // 100ms
  },

  // Configuración de backup
  BACKUP: {
    // Intervalo de backup automático
    AUTO_BACKUP_INTERVAL: 2 * 60 * 60 * 1000, // 2 horas
    // Tiempo de retención de backups
    RETENTION_TIME: 30 * 24 * 60 * 60 * 1000, // 30 días
    // Tamaño máximo de backup
    MAX_BACKUP_SIZE: 50 * 1024 * 1024 // 50MB
  },

  // Configuración de automatización
  AUTOMATION: {
    // Intervalo de verificación de precios
    PRICE_CHECK_INTERVAL: 6 * 60 * 60 * 1000, // 6 horas
    // Tiempo de delay para procesamiento
    PROCESSING_DELAY: 1000 // 1 segundo
  }
};

// Función para obtener configuración específica
export const getPerformanceConfig = (module, key) => {
  if (module && PERFORMANCE_CONFIG[module] && PERFORMANCE_CONFIG[module][key]) {
    return PERFORMANCE_CONFIG[module][key];
  }
  return PERFORMANCE_CONFIG.CACHE.DEFAULT_CACHE_TIME;
};

// Función para validar configuración de performance
export const validatePerformanceConfig = (config) => {
  const errors = [];

  // Validar tiempos de caché
  if (config.CACHE_TIME && config.CACHE_TIME < 1000) {
    errors.push('CACHE_TIME debe ser al menos 1000ms');
  }

  if (config.STALE_TIME && config.STALE_TIME >= config.CACHE_TIME) {
    errors.push('STALE_TIME debe ser menor que CACHE_TIME');
  }

  // Validar tiempos de debounce
  if (config.DEBOUNCE && config.DEBOUNCE < 0) {
    errors.push('DEBOUNCE debe ser un número positivo');
  }

  // Validar tiempos de throttle
  if (config.THROTTLE && config.THROTTLE < 0) {
    errors.push('THROTTLE debe ser un número positivo');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Función para optimizar configuración basada en el dispositivo
export const optimizeForDevice = () => {
  const isMobile = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency < 4;

  if (isMobile || isLowEnd) {
    return {
      ...PERFORMANCE_CONFIG,
      CACHE: {
        ...PERFORMANCE_CONFIG.CACHE,
        DEFAULT_CACHE_TIME: 2 * 60 * 1000, // Reducir a 2 minutos
        DEFAULT_STALE_TIME: 1 * 60 * 1000 // Reducir a 1 minuto
      },
      CHARTS: {
        ...PERFORMANCE_CONFIG.CHARTS,
        MAX_LINE_POINTS: 50, // Reducir puntos en gráficos
        MAX_BAR_ITEMS: 10 // Reducir elementos en barras
      }
    };
  }

  return PERFORMANCE_CONFIG;
};

export default PERFORMANCE_CONFIG;
