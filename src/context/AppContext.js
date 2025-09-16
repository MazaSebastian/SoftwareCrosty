import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { calcularEstadisticas } from '../services/estadisticasService';
import { cargarUsuarioActual, establecerUsuarioActual } from '../services/usuariosService';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const cargarUsuario = () => {
      try {
        const usuarioGuardado = cargarUsuarioActual();
        if (usuarioGuardado) {
          setUsuario(usuarioGuardado);
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      }
    };

    cargarUsuario();
  }, []);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (usuario) {
      establecerUsuarioActual(usuario);
    }
  }, [usuario]);

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
    setUsuario,
    estadisticas,
    setEstadisticas,
    actualizarEstadisticas
  }), [usuario, estadisticas, actualizarEstadisticas]);

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



