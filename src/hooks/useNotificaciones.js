import { useState, useEffect, useCallback } from 'react';
import { 
  obtenerContadorNotificaciones, 
  obtenerTodasNotificacionesPendientes,
  marcarSectorComoLeido,
  verificarAlertasStock,
  verificarAlertasCaja,
  verificarVentaGrande,
  verificarTareasPendientes
} from '../services/notificacionesService';

export const useNotificaciones = () => {
  const [contadores, setContadores] = useState({
    caja: 0,
    ventas: 0,
    insumos: 0,
    planificaciones: 0,
    reportes: 0,
    sistema: 0
  });
  
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para actualizar contadores de notificaciones
  const actualizarContadores = useCallback(async () => {
    try {
      setLoading(true);
      
      const nuevosContadores = {
        caja: await obtenerContadorNotificaciones('caja'),
        ventas: await obtenerContadorNotificaciones('ventas'),
        insumos: await obtenerContadorNotificaciones('insumos'),
        planificaciones: await obtenerContadorNotificaciones('planificaciones'),
        reportes: await obtenerContadorNotificaciones('reportes'),
        sistema: await obtenerContadorNotificaciones('sistema')
      };
      
      setContadores(nuevosContadores);
    } catch (error) {
      console.error('Error actualizando contadores de notificaciones:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para cargar todas las notificaciones
  const cargarNotificaciones = useCallback(async () => {
    try {
      const todasNotificaciones = await obtenerTodasNotificacionesPendientes();
      setNotificaciones(todasNotificaciones);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  }, []);

  // Función para marcar sector como leído
  const marcarSectorLeido = useCallback(async (sector) => {
    try {
      await marcarSectorComoLeido(sector);
      await actualizarContadores();
      await cargarNotificaciones();
    } catch (error) {
      console.error('Error marcando sector como leído:', error);
    }
  }, [actualizarContadores, cargarNotificaciones]);

  // Función para verificar alertas automáticas
  const verificarAlertas = useCallback(async (datos) => {
    try {
      let alertasCreadas = 0;
      
      // Verificar alertas de stock
      if (datos.insumos) {
        const alertasStock = await verificarAlertasStock(datos.insumos);
        alertasCreadas += alertasStock;
      }
      
      // Verificar alertas de caja
      if (datos.saldoCaja !== undefined) {
        const alertasCaja = await verificarAlertasCaja(datos.saldoCaja);
        alertasCreadas += alertasCaja;
      }
      
      // Verificar ventas grandes
      if (datos.montoVenta) {
        await verificarVentaGrande(datos.montoVenta);
        alertasCreadas += 1;
      }
      
      // Verificar tareas pendientes
      if (datos.planificaciones) {
        const alertasTareas = await verificarTareasPendientes(datos.planificaciones);
        alertasCreadas += alertasTareas;
      }
      
      // Actualizar contadores si se crearon alertas
      if (alertasCreadas > 0) {
        await actualizarContadores();
        await cargarNotificaciones();
      }
      
      return alertasCreadas;
    } catch (error) {
      console.error('Error verificando alertas:', error);
      return 0;
    }
  }, [actualizarContadores, cargarNotificaciones]);

  // Efecto para cargar contadores iniciales
  useEffect(() => {
    actualizarContadores();
    cargarNotificaciones();
  }, [actualizarContadores, cargarNotificaciones]);

  // Efecto para actualizar contadores cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      actualizarContadores();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [actualizarContadores]);

  return {
    contadores,
    notificaciones,
    loading,
    actualizarContadores,
    cargarNotificaciones,
    marcarSectorLeido,
    verificarAlertas
  };
};
