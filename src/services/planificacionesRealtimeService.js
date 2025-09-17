import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { TABLES } from '../config/supabase';

// Servicio de sincronización en tiempo real para planificaciones
class PlanificacionesRealtimeService {
  constructor() {
    this.subscriptions = new Map();
    this.listeners = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  // Inicializar el servicio de sincronización
  async initialize() {
    try {
      console.log('🔄 Inicializando servicio de sincronización de planificaciones...');

      // Configurar listeners para diferentes eventos
      this.setupPlanificacionesListeners();
      this.setupTareasListeners();
      this.setupConnectionListeners();

      this.isConnected = true;
      console.log('✅ Servicio de sincronización de planificaciones inicializado');

      return true;
    } catch (error) {
      console.error('❌ Error inicializando servicio de sincronización:', error);
      this.isConnected = false;
      return false;
    }
  }

  // Configurar listeners para planificaciones
  setupPlanificacionesListeners() {
    const planificacionesSubscription = supabase
      .channel('planificaciones_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'planificaciones'
        },
        (payload) => {
          console.log('🆕 Nueva planificación detectada:', payload);
          this.handleNuevaPlanificacion(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'planificaciones'
        },
        (payload) => {
          console.log('🔄 Planificación actualizada:', payload);
          this.handlePlanificacionActualizada(payload.new, payload.old);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'planificaciones'
        },
        (payload) => {
          console.log('🗑️ Planificación eliminada:', payload);
          this.handlePlanificacionEliminada(payload.old);
        }
      )
      .subscribe((status) => {
        console.log('Estado de suscripción planificaciones:', status);
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.notifyListeners('connection', { status: 'connected' });
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnection();
        }
      });

    this.subscriptions.set('planificaciones', planificacionesSubscription);
  }

  // Configurar listeners para tareas
  setupTareasListeners() {
    const tareasSubscription = supabase
      .channel('tareas_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'planificaciones_tareas'
        },
        (payload) => {
          console.log('🆕 Nueva tarea detectada:', payload);
          this.handleNuevaTarea(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'planificaciones_tareas'
        },
        (payload) => {
          console.log('🔄 Tarea actualizada:', payload);
          this.handleTareaActualizada(payload.new, payload.old);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'planificaciones_tareas'
        },
        (payload) => {
          console.log('🗑️ Tarea eliminada:', payload);
          this.handleTareaEliminada(payload.old);
        }
      )
      .subscribe((status) => {
        console.log('Estado de suscripción tareas:', status);
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.notifyListeners('connection', { status: 'connected' });
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnection();
        }
      });

    this.subscriptions.set('tareas', tareasSubscription);
  }

  // Configurar listeners de conexión
  setupConnectionListeners() {
    console.log('📡 Configurando listeners de conexión...');
  }

  // Manejar nueva planificación
  handleNuevaPlanificacion(planificacion) {
    const planificacionFormateada = this.formatearPlanificacion(planificacion);
    this.notifyListeners('nueva_planificacion', planificacionFormateada);
    this.sendNotification('Nueva Planificación', `Se ha creado una nueva planificación: ${planificacionFormateada.nombre}`);
  }

  // Manejar planificación actualizada
  handlePlanificacionActualizada(nueva, anterior) {
    const nuevaFormateada = this.formatearPlanificacion(nueva);
    const anteriorFormateada = this.formatearPlanificacion(anterior);
    this.notifyListeners('planificacion_actualizada', { nueva: nuevaFormateada, anterior: anteriorFormateada });
    this.sendNotification('Planificación Actualizada', `La planificación "${nuevaFormateada.nombre}" ha sido actualizada`);
  }

  // Manejar planificación eliminada
  handlePlanificacionEliminada(planificacion) {
    const planificacionFormateada = this.formatearPlanificacion(planificacion);
    this.notifyListeners('planificacion_eliminada', planificacionFormateada);
    this.sendNotification('Planificación Eliminada', `La planificación "${planificacionFormateada.nombre}" ha sido eliminada`);
  }

  // Manejar nueva tarea
  handleNuevaTarea(tarea) {
    const tareaFormateada = this.formatearTarea(tarea);
    this.notifyListeners('nueva_tarea', tareaFormateada);
    this.sendNotification('Nueva Tarea', `Se ha creado una nueva tarea: ${tareaFormateada.titulo}`);
  }

  // Manejar tarea actualizada
  handleTareaActualizada(nueva, anterior) {
    const nuevaFormateada = this.formatearTarea(nueva);
    const anteriorFormateada = this.formatearTarea(anterior);
    this.notifyListeners('tarea_actualizada', { nueva: nuevaFormateada, anterior: anteriorFormateada });
    this.sendNotification('Tarea Actualizada', `La tarea "${nuevaFormateada.titulo}" ha sido actualizada`);
  }

  // Manejar tarea eliminada
  handleTareaEliminada(tarea) {
    const tareaFormateada = this.formatearTarea(tarea);
    this.notifyListeners('tarea_eliminada', tareaFormateada);
    this.sendNotification('Tarea Eliminada', `La tarea "${tareaFormateada.titulo}" ha sido eliminada`);
  }

  // Formatear planificación para consistencia
  formatearPlanificacion(planificacion) {
    return {
      id: planificacion.id,
      nombre: planificacion.nombre,
      descripcion: planificacion.descripcion,
      fecha: planificacion.fecha,
      tipo: planificacion.tipo,
      prioridad: planificacion.prioridad,
      estado: planificacion.estado,
      usuarioId: planificacion.usuario_id,
      usuarioNombre: planificacion.usuario_nombre,
      activo: planificacion.activo,
      createdAt: planificacion.created_at,
      updatedAt: planificacion.updated_at,
    };
  }

  // Formatear tarea para consistencia
  formatearTarea(tarea) {
    return {
      id: tarea.id,
      planificacionId: tarea.planificacion_id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      tipo: tarea.tipo,
      prioridad: tarea.prioridad,
      estado: tarea.estado,
      horaInicio: tarea.hora_inicio,
      horaFin: tarea.hora_fin,
      duracionEstimada: tarea.duracion_estimada,
      usuarioAsignadoId: tarea.usuario_asignado_id,
      usuarioAsignadoNombre: tarea.usuario_asignado_nombre,
      observaciones: tarea.observaciones,
      activo: tarea.activo,
      createdAt: tarea.created_at,
      updatedAt: tarea.updated_at,
    };
  }

  // Enviar notificación al navegador
  sendNotification(title, body) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/crosty-logo.png',
        tag: `planificacion-${Date.now()}`
      });
    }
  }

  // Manejar reconexión automática
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

  // Notificar a todos los listeners de un evento
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Obtener estado de conexión
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      status: this.isConnected ? 'connected' : 'disconnected'
    };
  }

  // Limpiar suscripciones
  unsubscribeAll() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
    this.listeners.clear();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    console.log('🚫 Todas las suscripciones de planificaciones canceladas.');
  }
}

// Instancia singleton
const planificacionesRealtimeService = new PlanificacionesRealtimeService();

// Hook personalizado para usar el servicio
export const usePlanificacionesRealtime = () => {
  const [planificaciones, setPlanificaciones] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    reconnectAttempts: 0
  });

  useEffect(() => {
    let isMounted = true;

    // Inicializar el servicio de forma segura
    const initializeService = async () => {
      try {
        await planificacionesRealtimeService.initialize();

        if (isMounted) {
          setConnectionStatus(planificacionesRealtimeService.getConnectionStatus());
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
    planificaciones,
    tareas,
    connectionStatus,
    addListener: planificacionesRealtimeService.addListener.bind(planificacionesRealtimeService),
    getConnectionStatus: planificacionesRealtimeService.getConnectionStatus.bind(planificacionesRealtimeService)
  };
};

// Funciones de utilidad
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Permiso de notificación concedido.');
    } else {
      console.warn('Permiso de notificación denegado.');
    }
    return permission;
  }
  console.warn('Las notificaciones no son soportadas por este navegador.');
  return 'denied';
};

export default planificacionesRealtimeService;
