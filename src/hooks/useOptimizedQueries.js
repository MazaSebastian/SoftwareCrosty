import { useState, useEffect, useCallback, useMemo } from 'react';
import { useMemoizedData } from './useMemoizedData';

// Hook para optimizar consultas de datos con caché inteligente
export const useOptimizedQueries = () => {
  const [queryCache, setQueryCache] = useState(new Map());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Detectar cambios en el estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Función para crear una consulta optimizada
  const createQuery = useCallback((key, fetchFunction, options = {}) => {
    const {
      cacheTime = 5 * 60 * 1000, // 5 minutos
      staleTime = 2 * 60 * 1000, // 2 minutos
      retry = 3,
      retryDelay = 1000,
      enabled = true
    } = options;

    return useMemoizedData(fetchFunction, [key], {
      cacheTime,
      staleTime,
      refetchOnMount: true,
      enabled: enabled && isOnline
    });
  }, [isOnline]);

  // Función para invalidar caché específico
  const invalidateQuery = useCallback((key) => {
    setQueryCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  // Función para limpiar todo el caché
  const clearCache = useCallback(() => {
    setQueryCache(new Map());
  }, []);

  // Función para obtener estadísticas del caché
  const getCacheStats = useCallback(() => {
    return {
      size: queryCache.size,
      keys: Array.from(queryCache.keys()),
      isOnline
    };
  }, [queryCache, isOnline]);

  return {
    createQuery,
    invalidateQuery,
    clearCache,
    getCacheStats,
    isOnline
  };
};

// Hook específico para consultas de ventas
export const useVentasQuery = (filtros = {}) => {
  const { createQuery } = useOptimizedQueries();
  
  return createQuery(
    `ventas-${JSON.stringify(filtros)}`,
    async () => {
      const { obtenerVentas } = await import('../services/ventasService');
      return await obtenerVentas(filtros);
    },
    {
      cacheTime: 2 * 60 * 1000, // 2 minutos para ventas
      staleTime: 30 * 1000 // 30 segundos
    }
  );
};

// Hook específico para consultas de caja
export const useCajaQuery = (filtros = {}) => {
  const { createQuery } = useOptimizedQueries();
  
  return createQuery(
    `caja-${JSON.stringify(filtros)}`,
    async () => {
      const { obtenerMovimientosCaja } = await import('../services/cajaService');
      return await obtenerMovimientosCaja(filtros);
    },
    {
      cacheTime: 1 * 60 * 1000, // 1 minuto para caja
      staleTime: 15 * 1000 // 15 segundos
    }
  );
};

// Hook específico para consultas de insumos
export const useInsumosQuery = () => {
  const { createQuery } = useOptimizedQueries();
  
  return createQuery(
    'insumos',
    async () => {
      const { obtenerInsumos } = await import('../services/insumosService');
      return await obtenerInsumos();
    },
    {
      cacheTime: 10 * 60 * 1000, // 10 minutos para insumos
      staleTime: 5 * 60 * 1000 // 5 minutos
    }
  );
};

// Hook específico para consultas de recetas
export const useRecetasQuery = () => {
  const { createQuery } = useOptimizedQueries();
  
  return createQuery(
    'recetas',
    async () => {
      const { obtenerRecetas } = await import('../services/recetasService');
      return await obtenerRecetas();
    },
    {
      cacheTime: 15 * 60 * 1000, // 15 minutos para recetas
      staleTime: 10 * 60 * 1000 // 10 minutos
    }
  );
};

// Hook específico para consultas de stock
export const useStockQuery = () => {
  const { createQuery } = useOptimizedQueries();
  
  return createQuery(
    'stock',
    async () => {
      const { obtenerProductosStock } = await import('../services/stockService');
      return await obtenerProductosStock();
    },
    {
      cacheTime: 5 * 60 * 1000, // 5 minutos para stock
      staleTime: 2 * 60 * 1000 // 2 minutos
    }
  );
};

// Hook específico para consultas de reportes
export const useReportesQuery = (tipo, filtros = {}) => {
  const { createQuery } = useOptimizedQueries();
  
  return createQuery(
    `reportes-${tipo}-${JSON.stringify(filtros)}`,
    async () => {
      const { generarReporteVentas, generarReporteCaja, generarReporteInsumos, generarReporteRecetas } = await import('../services/reportesService');
      
      switch (tipo) {
        case 'ventas':
          return await generarReporteVentas(filtros);
        case 'caja':
          return await generarReporteCaja(filtros);
        case 'insumos':
          return await generarReporteInsumos(filtros);
        case 'recetas':
          return await generarReporteRecetas(filtros);
        default:
          throw new Error(`Tipo de reporte no válido: ${tipo}`);
      }
    },
    {
      cacheTime: 10 * 60 * 1000, // 10 minutos para reportes
      staleTime: 5 * 60 * 1000 // 5 minutos
    }
  );
};

export default useOptimizedQueries;
