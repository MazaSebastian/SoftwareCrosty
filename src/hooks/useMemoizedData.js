import { useState, useEffect, useMemo, useCallback } from 'react';

// Hook personalizado para memoización de datos y optimización de performance
export const useMemoizedData = (fetchFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const {
    cacheTime = 5 * 60 * 1000, // 5 minutos por defecto
    staleTime = 2 * 60 * 1000, // 2 minutos por defecto
    refetchOnMount = true,
    enabled = true
  } = options;

  // Función memoizada para obtener datos
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    const now = Date.now();
    
    // Verificar si los datos están frescos y no necesitan actualización
    if (!forceRefresh && data && lastFetch && (now - lastFetch) < staleTime) {
      return data;
    }

    // Verificar si los datos están en caché y aún son válidos
    if (!forceRefresh && data && lastFetch && (now - lastFetch) < cacheTime) {
      return data;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      setData(result);
      setLastFetch(now);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, enabled, data, lastFetch, staleTime, cacheTime]);

  // Efecto para cargar datos cuando cambian las dependencias
  useEffect(() => {
    if (refetchOnMount || !data) {
      fetchData();
    }
  }, dependencies);

  // Memoizar los datos para evitar re-renders innecesarios
  const memoizedData = useMemo(() => {
    return data;
  }, [data]);

  // Función para invalidar caché y forzar actualización
  const invalidate = useCallback(() => {
    setData(null);
    setLastFetch(null);
    fetchData(true);
  }, [fetchData]);

  // Función para refrescar datos
  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data: memoizedData,
    loading,
    error,
    refetch,
    invalidate,
    isStale: lastFetch ? (Date.now() - lastFetch) > staleTime : true,
    isCached: !!data && !!lastFetch
  };
};

// Hook para memoización de cálculos complejos
export const useMemoizedCalculation = (calculationFunction, dependencies = []) => {
  return useMemo(() => {
    return calculationFunction();
  }, dependencies);
};

// Hook para debounce de funciones
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para throttle de funciones
export const useThrottle = (callback, delay) => {
  const [throttledCallback, setThrottledCallback] = useState(callback);

  useEffect(() => {
    let timeoutId;
    let lastExecTime = 0;

    const throttled = (...args) => {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        callback(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          callback(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };

    setThrottledCallback(() => throttled);
  }, [callback, delay]);

  return throttledCallback;
};

export default useMemoizedData;
