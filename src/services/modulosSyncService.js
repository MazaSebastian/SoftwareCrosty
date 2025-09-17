import React from 'react';
import { supabase } from '../config/supabase';
import { TABLES } from '../config/supabase';
import { obtenerUsuarioActual } from './usuariosService';

// Servicio de sincronización entre módulos
class ModulosSyncService {
  constructor() {
    this.listeners = new Map();
  }

  // Inicializar el servicio de sincronización entre módulos
  async initialize() {
    try {
      console.log('🔄 Inicializando servicio de sincronización entre módulos...');
      
      // Configurar listeners para sincronización entre módulos
      this.setupVentasToCajaListeners();
      
      console.log('✅ Servicio de sincronización entre módulos inicializado');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando servicio de sincronización entre módulos:', error);
      return false;
    }
  }

  // Configurar listeners para sincronización VENTAS → CAJA DIARIA
  setupVentasToCajaListeners() {
    // Listener para nuevas ventas que deben crear movimientos de caja
    const ventasToCajaSubscription = supabase
      .channel('ventas_to_caja_sync')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ventas'
        },
        (payload) => {
          console.log('💰 Nueva venta detectada para sincronizar con caja:', payload);
          this.handleNuevaVentaToCaja(payload.new);
        }
      )
      .subscribe((status) => {
        console.log('📡 Estado de suscripción ventas→caja:', status);
      });

    this.listeners.set('ventas_to_caja', ventasToCajaSubscription);
  }

  // Manejar nueva venta para crear movimiento de caja automático
  async handleNuevaVentaToCaja(venta) {
    try {
      console.log('🔄 Procesando venta para movimiento de caja:', venta);
      
      const usuarioActual = obtenerUsuarioActual();
      
      // Crear movimiento de caja automático basado en la venta
      const movimientoCaja = {
        fecha: venta.fecha,
        tipo: 'ingreso',
        concepto: `Venta: ${venta.producto}`,
        monto: parseFloat(venta.subtotal),
        metodo_pago: venta.metodo_pago,
        usuario_id: usuarioActual?.id || venta.usuario_id,
        usuario_nombre: usuarioActual?.nombre || venta.usuario_nombre || 'Usuario',
        venta_id: venta.id, // Referencia a la venta original
        descripcion: `Venta automática: ${venta.cantidad} x ${venta.producto}`,
        activa: true
      };

      // Insertar movimiento de caja en Supabase
      const { data, error } = await supabase
        .from(TABLES.MOVIMIENTOS_CAJA)
        .insert(movimientoCaja)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creando movimiento de caja automático:', error);
        throw error;
      }

      console.log('✅ Movimiento de caja creado automáticamente:', data);
      
      // Notificar a los listeners
      this.notifyListeners('movimiento_caja_creado', {
        movimiento: data,
        venta: venta
      });

    } catch (error) {
      console.error('❌ Error procesando venta para caja:', error);
    }
  }

  // Agregar listener para eventos
  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // Retornar función para remover el listener
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Notificar a todos los listeners
  notifyListeners(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error en listener de ${event}:`, error);
        }
      });
    }
  }

  // Obtener estadísticas actualizadas de caja
  async obtenerEstadisticasCajaActualizadas() {
    try {
      const { data, error } = await supabase
        .from(TABLES.MOVIMIENTOS_CAJA)
        .select('*')
        .eq('activa', true);

      if (error) {
        console.error('Error obteniendo movimientos de caja:', error);
        throw error;
      }

      // Calcular estadísticas
      const movimientos = data || [];
      const totalIngresos = movimientos
        .filter(m => m.tipo === 'ingreso')
        .reduce((sum, m) => sum + parseFloat(m.monto || 0), 0);
      
      const totalEgresos = movimientos
        .filter(m => m.tipo === 'egreso')
        .reduce((sum, m) => sum + parseFloat(m.monto || 0), 0);

      const saldoTotal = totalIngresos - totalEgresos;

      return {
        totalIngresos,
        totalEgresos,
        saldoTotal,
        totalMovimientos: movimientos.length,
        movimientos
      };
    } catch (error) {
      console.error('Error calculando estadísticas de caja:', error);
      return {
        totalIngresos: 0,
        totalEgresos: 0,
        saldoTotal: 0,
        totalMovimientos: 0,
        movimientos: []
      };
    }
  }

  // Limpiar recursos
  cleanup() {
    console.log('🧹 Limpiando servicio de sincronización entre módulos...');
    
    this.listeners.forEach((subscription, key) => {
      console.log(`🔌 Desuscribiendo de ${key}`);
      supabase.removeChannel(subscription);
    });
    
    this.listeners.clear();
  }
}

// Instancia singleton
const modulosSyncService = new ModulosSyncService();

// Hook personalizado para usar el servicio
export const useModulosSync = () => {
  const [estadisticasCaja, setEstadisticasCaja] = React.useState({
    totalIngresos: 0,
    totalEgresos: 0,
    saldoTotal: 0,
    totalMovimientos: 0
  });

  React.useEffect(() => {
    let isMounted = true;

    // Inicializar el servicio
    const initializeService = async () => {
      try {
        await modulosSyncService.initialize();
        
        if (isMounted) {
          // Cargar estadísticas iniciales
          const stats = await modulosSyncService.obtenerEstadisticasCajaActualizadas();
          setEstadisticasCaja(stats);
        }
      } catch (error) {
        console.warn('Servicio de sincronización entre módulos no disponible:', error);
      }
    };

    initializeService();

    // Listener para movimientos de caja creados automáticamente
    const removeMovimientoListener = modulosSyncService.addListener('movimiento_caja_creado', async (data) => {
      if (isMounted) {
        console.log('🔄 Actualizando estadísticas de caja por nueva venta:', data);
        const stats = await modulosSyncService.obtenerEstadisticasCajaActualizadas();
        setEstadisticasCaja(stats);
      }
    });

    // Cleanup
    return () => {
      isMounted = false;
      removeMovimientoListener();
    };
  }, []);

  return {
    estadisticasCaja,
    addListener: modulosSyncService.addListener.bind(modulosSyncService),
    obtenerEstadisticasCajaActualizadas: modulosSyncService.obtenerEstadisticasCajaActualizadas.bind(modulosSyncService)
  };
};

export default modulosSyncService;
