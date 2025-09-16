import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { calcularEstadisticas } from '../services/estadisticasService';
import { cargarUsuarioActual, establecerUsuarioActual } from '../services/usuariosService';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const cargarUsuario = () => {
      try {
        const usuarioGuardado = cargarUsuarioActual();
        if (usuarioGuardado) {
          // Verificar si el usuario tiene UUID válido
          if (usuarioGuardado.id && usuarioGuardado.id.length > 10) {
            setUsuario(usuarioGuardado);
            console.log('✅ Usuario cargado con UUID válido:', usuarioGuardado.id);
          } else {
            console.log('❌ Usuario con ID inválido, limpiando localStorage');
            localStorage.clear();
          }
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.clear();
      }
    };

    cargarUsuario();
  }, []);

  // Guardar usuario en localStorage cuando cambie (memoizado)
  const handleSetUsuario = useCallback((newUsuario) => {
    setUsuario(newUsuario);
    if (newUsuario) {
      establecerUsuarioActual(newUsuario);
    }
  }, []);

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(() => ({
    usuario,
    setUsuario: handleSetUsuario,
    estadisticas,
    setEstadisticas,
    isLoading,
    setIsLoading
  }), [usuario, handleSetUsuario, estadisticas, isLoading]);

  // Actualizar estadísticas (memoizada para evitar re-renders)
  const actualizarEstadisticas = useCallback(async () => {
    try {
      const stats = await calcularEstadisticas();
      setEstadisticas(stats);
      return stats;
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
      throw error;
    }
  }, []);

  // Cargar estadísticas al iniciar y cuando cambie el usuario
  useEffect(() => {
    if (usuario) {
      actualizarEstadisticas();
    }
  }, [usuario]);

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const value = useMemo(() => ({
    usuario,
    setUsuario: handleSetUsuario,
    estadisticas,
    setEstadisticas,
    actualizarEstadisticas,
    isLoading,
    setIsLoading
  }), [usuario, handleSetUsuario, estadisticas, actualizarEstadisticas, isLoading]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};



