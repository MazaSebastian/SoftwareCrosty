import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useToast } from '../components/Toast';

// Configuración de sincronización en tiempo real para ventas
class VentasRealtimeService {
  constructor() {
    this.subscriptions = new Map();
    this.listeners = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // 1 segundo
  }

  // Inicializar el servicio de sincronización
  async initialize() {
    try {
      console.log('🔄 Inicializando servicio de sincronización de ventas...');
      
      // Configurar listeners para diferentes eventos
      this.setupVentasListeners();
      this.setupConnectionListeners();
      
      this.isConnected = true;
      console.log('✅ Servicio de sincronización de ventas inicializado');
      
      return true;
    } catch (error) {
      console.error('❌ Error inicializando servicio de sincronización:', error);
      // No intentar reconectar automáticamente para evitar loops
      this.isConnected = false;
      return false;
    }
  }

  // Configurar listeners para ventas
  setupVentasListeners() {
    // Listener para nuevas ventas
    const ventasSubscription = supabase
      .channel('ventas_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ventas'
        },
        (payload) => {
          console.log('🆕 Nueva venta detectada:', payload);
          this.handleNuevaVenta(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ventas'
        },
        (payload) => {
          console.log('🔄 Venta actualizada:', payload);
          this.handleVentaActualizada(payload.new, payload.old);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'ventas'
        },
        (payload) => {
          console.log('🗑️ Venta eliminada:', payload);
          this.handleVentaEliminada(payload.old);
        }
      )
      .subscribe((status) => {
        console.log('📡 Estado de suscripción ventas:', status);
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          this.reconnectAttempts = 0;
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnection();
        }
      });

    this.subscriptions.set('ventas', ventasSubscription);
  }

  // Configurar listeners de conexión
  setupConnectionListeners() {
    // Los listeners de conexión se manejan a través de los canales
    // No hay métodos directos onOpen/onClose en la API actual de Supabase
    console.log('📡 Configurando listeners de conexión...');
  }

  // Manejar nueva venta
  handleNuevaVenta(venta) {
    const ventaFormateada = this.formatearVenta(venta);
    
    // Notificar a todos los listeners
    this.notifyListeners('nueva_venta', ventaFormateada);
    
    // Mostrar notificación si no es del usuario actual
    if (!this.esVentaDelUsuarioActual(venta)) {
      this.mostrarNotificacionVenta(ventaFormateada);
    }
  }

  // Manejar venta actualizada
  handleVentaActualizada(ventaNueva, ventaAnterior) {
    const ventaFormateada = this.formatearVenta(ventaNueva);
    
    this.notifyListeners('venta_actualizada', {
      nueva: ventaFormateada,
      anterior: this.formatearVenta(ventaAnterior)
    });
  }

  // Manejar venta eliminada
  handleVentaEliminada(venta) {
    const ventaFormateada = this.formatearVenta(venta);
    
    this.notifyListeners('venta_eliminada', ventaFormateada);
  }

  // Formatear venta para el frontend
  formatearVenta(venta) {
    return {
      id: venta.id,
      fecha: venta.fecha,
      producto: venta.producto,
      cantidad: venta.cantidad,
      precioUnitario: parseFloat(venta.precio_unitario),
      subtotal: parseFloat(venta.subtotal),
      metodoPago: venta.metodo_pago,
      usuarioId: venta.usuario_id,
      usuarioNombre: venta.usuario_nombre,
      cliente: venta.cliente,
      observaciones: venta.observaciones,
      createdAt: venta.created_at
    };
  }

  // Verificar si la venta es del usuario actual
  esVentaDelUsuarioActual(venta) {
    const usuarioActual = this.obtenerUsuarioActual();
    return usuarioActual && venta.usuario_id === usuarioActual.id;
  }

  // Obtener usuario actual
  obtenerUsuarioActual() {
    const usuario = localStorage.getItem('usuarioActual');
    return usuario ? JSON.parse(usuario) : null;
  }

  // Mostrar notificación de nueva venta
  mostrarNotificacionVenta(venta) {
    // Importar dinámicamente useToast para evitar problemas de contexto
    import('../components/Toast').then(({ useToast }) => {
      // Esta función se ejecutará cuando se use en un componente
      console.log('🔔 Nueva venta de otro usuario:', venta);
    });

    // Notificación nativa del navegador
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nueva Venta - CROSTY', {
        body: `${venta.usuarioNombre} vendió ${venta.cantidad} ${venta.producto}`,
        icon: '/favicon.ico',
        tag: `venta-${venta.id}`
      });
    }
  }

  // Manejar reconexión automática (simplificado)
  handleReconnection() {
    console.log('🔄 Intentando reconectar servicio de sincronización...');
    this.isConnected = false;
    this.notifyListeners('connection', { status: 'disconnected' });
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

  // Obtener estado de conexión
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }

  // Limpiar recursos
  cleanup() {
    console.log('🧹 Limpiando servicio de sincronización...');
    
    // Desuscribir de todas las suscripciones
    this.subscriptions.forEach((subscription, key) => {
      console.log(`🔌 Desuscribiendo de ${key}`);
      supabase.removeChannel(subscription);
    });
    
    this.subscriptions.clear();
    this.listeners.clear();
    this.isConnected = false;
  }

  // Destruir el servicio
  destroy() {
    console.log('💥 Destruyendo servicio de sincronización...');
    this.cleanup();
  }
}

// Instancia singleton
const ventasRealtimeService = new VentasRealtimeService();

// Hook personalizado para usar el servicio (versión simplificada)
export const useVentasRealtime = () => {
  const [ventas, setVentas] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    reconnectAttempts: 0
  });

  useEffect(() => {
    let isMounted = true;

    // Inicializar el servicio de forma segura
    const initializeService = async () => {
      try {
        await ventasRealtimeService.initialize();
        
        if (isMounted) {
          setConnectionStatus(ventasRealtimeService.getConnectionStatus());
        }
      } catch (error) {
        console.warn('Servicio de sincronización no disponible:', error);
        if (isMounted) {
          setConnectionStatus({
            isConnected: false,
            reconnectAttempts: 0
          });
        }
      }
    };

    // Inicializar de forma asíncrona
    initializeService();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ventas,
    connectionStatus,
    addListener: ventasRealtimeService.addListener.bind(ventasRealtimeService),
    getConnectionStatus: ventasRealtimeService.getConnectionStatus.bind(ventasRealtimeService)
  };
};

// Funciones de utilidad
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const isNotificationSupported = () => {
  return 'Notification' in window;
};

export default ventasRealtimeService;
