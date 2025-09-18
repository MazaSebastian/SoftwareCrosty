// Importar servicio de usuarios y Supabase
import { obtenerUsuarioActual, obtenerNombreCompleto } from './usuariosService';
import { supabase, TABLES } from '../config/supabase';

// Tipos de notificaciones
export const TIPOS_NOTIFICACION = {
  STOCK_BAJO: 'stock_bajo',
  STOCK_CRITICO: 'stock_critico',
  STOCK_AGOTADO: 'stock_agotado',
  CAJA_BAJA: 'caja_baja',
  CAJA_CRITICA: 'caja_critica',
  TAREA_PENDIENTE: 'tarea_pendiente',
  TAREA_VENCIDA: 'tarea_vencida',
  VENTA_GRANDE: 'venta_grande',
  SINCRONIZACION: 'sincronizacion',
  SISTEMA: 'sistema'
};

// Prioridades de notificaciones
export const PRIORIDADES = {
  CRITICA: 'critica',
  ALTA: 'alta',
  MEDIA: 'media',
  BAJA: 'baja'
};

// Estados de notificaciones
export const ESTADOS = {
  PENDIENTE: 'pendiente',
  LEIDA: 'leida',
  ARCHIVADA: 'archivada'
};

// Función para crear una notificación
export async function crearNotificacion(notificacion) {
  const usuarioActual = obtenerUsuarioActual();
  
  const nuevaNotificacion = {
    id: crypto.randomUUID(),
    tipo: notificacion.tipo,
    titulo: notificacion.titulo,
    mensaje: notificacion.mensaje,
    prioridad: notificacion.prioridad || PRIORIDADES.MEDIA,
    estado: ESTADOS.PENDIENTE,
    sector: notificacion.sector,
    datos_adicionales: notificacion.datosAdicionales || {},
    usuario_id: usuarioActual.id,
    usuario_nombre: usuarioActual.nombre,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    // Guardar en Supabase
    const { data, error } = await supabase
      .from(TABLES.NOTIFICACIONES)
      .insert([nuevaNotificacion])
      .select()
      .single();

    if (error) throw error;
    
    console.log('✅ Notificación creada:', data);
    return data;
  } catch (error) {
    console.error('❌ Error creando notificación:', error);
    // Fallback a localStorage
    const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    notificaciones.push(nuevaNotificacion);
    localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
    return nuevaNotificacion;
  }
}

// Función para obtener notificaciones pendientes por sector
export async function obtenerNotificacionesPorSector(sector) {
  try {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICACIONES)
      .select('*')
      .eq('sector', sector)
      .eq('estado', ESTADOS.PENDIENTE)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error obteniendo notificaciones:', error);
    // Fallback a localStorage
    const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    return notificaciones.filter(n => n.sector === sector && n.estado === ESTADOS.PENDIENTE);
  }
}

// Función para obtener contador de notificaciones por sector
export async function obtenerContadorNotificaciones(sector) {
  const notificaciones = await obtenerNotificacionesPorSector(sector);
  return notificaciones.length;
}

// Función para marcar notificación como leída
export async function marcarComoLeida(notificacionId) {
  try {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICACIONES)
      .update({ 
        estado: ESTADOS.LEIDA,
        updated_at: new Date().toISOString()
      })
      .eq('id', notificacionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error marcando notificación como leída:', error);
    // Fallback a localStorage
    const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    const index = notificaciones.findIndex(n => n.id === notificacionId);
    if (index !== -1) {
      notificaciones[index].estado = ESTADOS.LEIDA;
      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
    }
  }
}

// Función para marcar todas las notificaciones de un sector como leídas
export async function marcarSectorComoLeido(sector) {
  try {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICACIONES)
      .update({ 
        estado: ESTADOS.LEIDA,
        updated_at: new Date().toISOString()
      })
      .eq('sector', sector)
      .eq('estado', ESTADOS.PENDIENTE)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error marcando sector como leído:', error);
    // Fallback a localStorage
    const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    notificaciones.forEach(n => {
      if (n.sector === sector && n.estado === ESTADOS.PENDIENTE) {
        n.estado = ESTADOS.LEIDA;
      }
    });
    localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
  }
}

// Función para obtener todas las notificaciones pendientes
export async function obtenerTodasNotificacionesPendientes() {
  try {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICACIONES)
      .select('*')
      .eq('estado', ESTADOS.PENDIENTE)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error obteniendo todas las notificaciones:', error);
    // Fallback a localStorage
    const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    return notificaciones.filter(n => n.estado === ESTADOS.PENDIENTE);
  }
}

// Función para limpiar notificaciones antiguas (más de 30 días)
export async function limpiarNotificacionesAntiguas() {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - 30);
  
  try {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICACIONES)
      .delete()
      .lt('created_at', fechaLimite.toISOString())
      .select();

    if (error) throw error;
    console.log('✅ Notificaciones antiguas limpiadas:', data?.length || 0);
    return data;
  } catch (error) {
    console.error('❌ Error limpiando notificaciones antiguas:', error);
  }
}

// Funciones específicas para crear alertas automáticas

// Alertas de stock
export async function verificarAlertasStock(insumos) {
  const alertas = [];
  
  insumos.forEach(insumo => {
    const stock = parseFloat(insumo.stockActual || insumo.cantidad || 0);
    
    if (stock === 0) {
      alertas.push({
        tipo: TIPOS_NOTIFICACION.STOCK_AGOTADO,
        titulo: 'Stock Agotado',
        mensaje: `${insumo.nombre} se ha agotado`,
        prioridad: PRIORIDADES.CRITICA,
        sector: 'insumos',
        datosAdicionales: { insumoId: insumo.id, insumoNombre: insumo.nombre }
      });
    } else if (stock <= 5) {
      alertas.push({
        tipo: TIPOS_NOTIFICACION.STOCK_CRITICO,
        titulo: 'Stock Crítico',
        mensaje: `${insumo.nombre} tiene solo ${stock} unidades`,
        prioridad: PRIORIDADES.ALTA,
        sector: 'insumos',
        datosAdicionales: { insumoId: insumo.id, insumoNombre: insumo.nombre, stock }
      });
    } else if (stock <= 10) {
      alertas.push({
        tipo: TIPOS_NOTIFICACION.STOCK_BAJO,
        titulo: 'Stock Bajo',
        mensaje: `${insumo.nombre} tiene ${stock} unidades`,
        prioridad: PRIORIDADES.MEDIA,
        sector: 'insumos',
        datosAdicionales: { insumoId: insumo.id, insumoNombre: insumo.nombre, stock }
      });
    }
  });
  
  // Crear notificaciones
  for (const alerta of alertas) {
    await crearNotificacion(alerta);
  }
  
  return alertas.length;
}

// Alertas de caja
export async function verificarAlertasCaja(saldoCaja) {
  const alertas = [];
  
  if (saldoCaja <= 5000) {
    alertas.push({
      tipo: TIPOS_NOTIFICACION.CAJA_CRITICA,
      titulo: 'Saldo de Caja Crítico',
      mensaje: `El saldo de caja es de $${saldoCaja.toLocaleString()}`,
      prioridad: PRIORIDADES.CRITICA,
      sector: 'caja',
      datosAdicionales: { saldo: saldoCaja }
    });
  } else if (saldoCaja <= 10000) {
    alertas.push({
      tipo: TIPOS_NOTIFICACION.CAJA_BAJA,
      titulo: 'Saldo de Caja Bajo',
      mensaje: `El saldo de caja es de $${saldoCaja.toLocaleString()}`,
      prioridad: PRIORIDADES.ALTA,
      sector: 'caja',
      datosAdicionales: { saldo: saldoCaja }
    });
  }
  
  // Crear notificaciones
  for (const alerta of alertas) {
    await crearNotificacion(alerta);
  }
  
  return alertas.length;
}

// Alertas de ventas grandes
export async function verificarVentaGrande(monto) {
  if (monto > 50000) {
    await crearNotificacion({
      tipo: TIPOS_NOTIFICACION.VENTA_GRANDE,
      titulo: 'Venta Importante',
      mensaje: `Se registró una venta de $${monto.toLocaleString()}`,
      prioridad: PRIORIDADES.MEDIA,
      sector: 'ventas',
      datosAdicionales: { monto }
    });
  }
}

// Alertas de tareas pendientes
export async function verificarTareasPendientes(planificaciones) {
  const hoy = new Date();
  const alertas = [];
  
  planificaciones.forEach(planificacion => {
    const fechaTarea = new Date(planificacion.fecha);
    
    if (fechaTarea < hoy && planificacion.estado === 'pendiente') {
      alertas.push({
        tipo: TIPOS_NOTIFICACION.TAREA_VENCIDA,
        titulo: 'Tarea Vencida',
        mensaje: `${planificacion.nombre} está vencida`,
        prioridad: PRIORIDADES.ALTA,
        sector: 'planificaciones',
        datosAdicionales: { planificacionId: planificacion.id, nombre: planificacion.nombre }
      });
    }
  });
  
  // Crear notificaciones
  for (const alerta of alertas) {
    await crearNotificacion(alerta);
  }
  
  return alertas.length;
}
