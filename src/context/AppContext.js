import React, { createContext, useContext, useState, useEffect } from 'react';
import { calcularEstadisticas } from '../services/estadisticasService';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('crosty_usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('crosty_usuario');
      }
    }
  }, []);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('crosty_usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('crosty_usuario');
    }
  }, [usuario]);

  // Actualizar estadísticas
  const actualizarEstadisticas = async () => {
    try {
      const stats = await calcularEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
    }
  };

  // Cargar estadísticas al iniciar y cuando cambie el usuario
  useEffect(() => {
    if (usuario) {
      actualizarEstadisticas();
    }
  }, [usuario]);

  const value = {
    usuario,
    setUsuario,
    estadisticas,
    setEstadisticas,
    actualizarEstadisticas
  };

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



