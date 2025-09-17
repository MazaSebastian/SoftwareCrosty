import { supabase } from '../config/supabase';

// Tipos de planificación disponibles
export const TIPOS_PLANIFICACION = {
  PRODUCCION: 'produccion',
  PRE_PRODUCCION: 'pre_produccion',
  CORTADO_VERDURAS: 'cortado_verduras',
  RECIBO_PEDIDOS: 'recibo_pedidos',
  LIMPIEZA: 'limpieza',
  INVENTARIO: 'inventario',
  MANTENIMIENTO: 'mantenimiento'
};

// Estados de tareas
export const ESTADOS_TAREA = {
  PENDIENTE: 'pendiente',
  EN_PROGRESO: 'en_progreso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
};

// Prioridades de tareas
export const PRIORIDADES = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  URGENTE: 'urgente'
};

// Obtener usuario actual
const obtenerUsuarioActual = () => {
  const usuario = localStorage.getItem('usuarioActual');
  return usuario ? JSON.parse(usuario) : null;
};

// Obtener nombre completo del usuario
const obtenerNombreCompleto = (usuario) => {
  if (!usuario) return 'Usuario no identificado';
  return `${usuario.nombre} ${usuario.apellido || ''}`.trim();
};

// ===== CRUD DE PLANIFICACIONES =====

// Obtener todas las planificaciones
export async function obtenerPlanificaciones(fechaInicio = null, fechaFin = null) {
  try {
    console.log('🔧 Obteniendo planificaciones...');
    
    let query = supabase
      .from('planificaciones')
      .select(`
        *,
        tareas:planificaciones_tareas(*)
      `)
      .order('fecha', { ascending: true });

    if (fechaInicio && fechaFin) {
      query = query.gte('fecha', fechaInicio).lte('fecha', fechaFin);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error obteniendo planificaciones:', error);
      throw error;
    }

    console.log('✅ Planificaciones obtenidas:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Error en obtenerPlanificaciones:', error);
    throw error;
  }
}

// Obtener planificación por ID
export async function obtenerPlanificacionPorId(id) {
  try {
    const { data, error } = await supabase
      .from('planificaciones')
      .select(`
        *,
        tareas:planificaciones_tareas(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error obteniendo planificación:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Error en obtenerPlanificacionPorId:', error);
    throw error;
  }
}

// Crear nueva planificación
export async function crearPlanificacion(planificacion) {
  try {
    const usuarioActual = obtenerUsuarioActual();
    
    console.log('🔧 Creando planificación:', planificacion);
    console.log('🔧 Usuario actual:', usuarioActual);

    const nuevaPlanificacion = {
      nombre: planificacion.nombre,
      descripcion: planificacion.descripcion || null,
      fecha: planificacion.fecha,
      tipo: planificacion.tipo,
      prioridad: planificacion.prioridad || PRIORIDADES.MEDIA,
      estado: ESTADOS_TAREA.PENDIENTE,
      usuario_id: usuarioActual?.id || null,
      usuario_nombre: usuarioActual ? obtenerNombreCompleto(usuarioActual) : 'Usuario no identificado',
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('planificaciones')
      .insert([nuevaPlanificacion])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando planificación:', error);
      throw error;
    }

    console.log('✅ Planificación creada:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en crearPlanificacion:', error);
    throw error;
  }
}

// Actualizar planificación
export async function actualizarPlanificacion(id, datos) {
  try {
    console.log('🔧 Actualizando planificación:', id, datos);

    const { data, error } = await supabase
      .from('planificaciones')
      .update({
        ...datos,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error actualizando planificación:', error);
      throw error;
    }

    console.log('✅ Planificación actualizada:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en actualizarPlanificacion:', error);
    throw error;
  }
}

// Eliminar planificación
export async function eliminarPlanificacion(id) {
  try {
    console.log('🔧 Eliminando planificación:', id);

    // Primero eliminar tareas relacionadas
    const { error: errorTareas } = await supabase
      .from('planificaciones_tareas')
      .delete()
      .eq('planificacion_id', id);

    if (errorTareas) {
      console.error('❌ Error eliminando tareas:', errorTareas);
      throw errorTareas;
    }

    // Luego eliminar la planificación
    const { error } = await supabase
      .from('planificaciones')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error eliminando planificación:', error);
      throw error;
    }

    console.log('✅ Planificación eliminada');
    return true;
  } catch (error) {
    console.error('❌ Error en eliminarPlanificacion:', error);
    throw error;
  }
}

// ===== CRUD DE TAREAS =====

// Crear tarea
export async function crearTarea(tarea) {
  try {
    const usuarioActual = obtenerUsuarioActual();
    
    console.log('🔧 Creando tarea:', tarea);

    const nuevaTarea = {
      planificacion_id: tarea.planificacion_id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || null,
      tipo: tarea.tipo,
      prioridad: tarea.prioridad || PRIORIDADES.MEDIA,
      estado: ESTADOS_TAREA.PENDIENTE,
      hora_inicio: tarea.hora_inicio || null,
      hora_fin: tarea.hora_fin || null,
      duracion_estimada: tarea.duracion_estimada || null,
      usuario_asignado_id: tarea.usuario_asignado_id || usuarioActual?.id || null,
      usuario_asignado_nombre: tarea.usuario_asignado_nombre || (usuarioActual ? obtenerNombreCompleto(usuarioActual) : 'Usuario no identificado'),
      observaciones: tarea.observaciones || null,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('planificaciones_tareas')
      .insert([nuevaTarea])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando tarea:', error);
      throw error;
    }

    console.log('✅ Tarea creada:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en crearTarea:', error);
    throw error;
  }
}

// Actualizar tarea
export async function actualizarTarea(id, datos) {
  try {
    console.log('🔧 Actualizando tarea:', id, datos);

    const { data, error } = await supabase
      .from('planificaciones_tareas')
      .update({
        ...datos,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error actualizando tarea:', error);
      throw error;
    }

    console.log('✅ Tarea actualizada:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en actualizarTarea:', error);
    throw error;
  }
}

// Eliminar tarea
export async function eliminarTarea(id) {
  try {
    console.log('🔧 Eliminando tarea:', id);

    const { error } = await supabase
      .from('planificaciones_tareas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error eliminando tarea:', error);
      throw error;
    }

    console.log('✅ Tarea eliminada');
    return true;
  } catch (error) {
    console.error('❌ Error en eliminarTarea:', error);
    throw error;
  }
}

// ===== FUNCIONES DE UTILIDAD =====

// Obtener planificaciones de la semana actual
export async function obtenerPlanificacionesSemanaActual() {
  const hoy = new Date();
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo
  inicioSemana.setHours(0, 0, 0, 0);
  
  const finSemana = new Date(inicioSemana);
  finSemana.setDate(inicioSemana.getDate() + 6); // Sábado
  finSemana.setHours(23, 59, 59, 999);

  return await obtenerPlanificaciones(
    inicioSemana.toISOString().split('T')[0],
    finSemana.toISOString().split('T')[0]
  );
}

// Obtener planificaciones por tipo
export async function obtenerPlanificacionesPorTipo(tipo) {
  try {
    const { data, error } = await supabase
      .from('planificaciones')
      .select(`
        *,
        tareas:planificaciones_tareas(*)
      `)
      .eq('tipo', tipo)
      .order('fecha', { ascending: true });

    if (error) {
      console.error('❌ Error obteniendo planificaciones por tipo:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error en obtenerPlanificacionesPorTipo:', error);
    throw error;
  }
}

// Obtener estadísticas de planificaciones
export async function obtenerEstadisticasPlanificaciones() {
  try {
    const { data, error } = await supabase
      .from('planificaciones')
      .select('estado, tipo, fecha');

    if (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }

    const estadisticas = {
      total: data.length,
      pendientes: data.filter(p => p.estado === ESTADOS_TAREA.PENDIENTE).length,
      enProgreso: data.filter(p => p.estado === ESTADOS_TAREA.EN_PROGRESO).length,
      completadas: data.filter(p => p.estado === ESTADOS_TAREA.COMPLETADA).length,
      porTipo: {}
    };

    // Contar por tipo
    Object.values(TIPOS_PLANIFICACION).forEach(tipo => {
      estadisticas.porTipo[tipo] = data.filter(p => p.tipo === tipo).length;
    });

    return estadisticas;
  } catch (error) {
    console.error('❌ Error en obtenerEstadisticasPlanificaciones:', error);
    throw error;
  }
}

// Crear template de planificación
export async function crearTemplatePlanificacion(template) {
  try {
    const usuarioActual = obtenerUsuarioActual();
    
    console.log('🔧 Creando template:', template);

    const nuevoTemplate = {
      nombre: template.nombre,
      descripcion: template.descripcion || null,
      tipo: template.tipo,
      tareas_template: JSON.stringify(template.tareas || []),
      usuario_id: usuarioActual?.id || null,
      usuario_nombre: usuarioActual ? obtenerNombreCompleto(usuarioActual) : 'Usuario no identificado',
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('planificaciones_templates')
      .insert([nuevoTemplate])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando template:', error);
      throw error;
    }

    console.log('✅ Template creado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en crearTemplatePlanificacion:', error);
    throw error;
  }
}

// Obtener templates
export async function obtenerTemplates() {
  try {
    const { data, error } = await supabase
      .from('planificaciones_templates')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (error) {
      console.error('❌ Error obteniendo templates:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error en obtenerTemplates:', error);
    throw error;
  }
}

// Aplicar template a planificación
export async function aplicarTemplate(planificacionId, templateId) {
  try {
    // Obtener template
    const { data: template, error: errorTemplate } = await supabase
      .from('planificaciones_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (errorTemplate) {
      console.error('❌ Error obteniendo template:', errorTemplate);
      throw errorTemplate;
    }

    // Crear tareas basadas en el template
    const tareas = JSON.parse(template.tareas_template || '[]');
    const tareasCreadas = [];

    for (const tareaTemplate of tareas) {
      const tarea = await crearTarea({
        planificacion_id: planificacionId,
        ...tareaTemplate
      });
      tareasCreadas.push(tarea);
    }

    console.log('✅ Template aplicado, tareas creadas:', tareasCreadas.length);
    return tareasCreadas;
  } catch (error) {
    console.error('❌ Error en aplicarTemplate:', error);
    throw error;
  }
}

export default {
  obtenerPlanificaciones,
  obtenerPlanificacionPorId,
  crearPlanificacion,
  actualizarPlanificacion,
  eliminarPlanificacion,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  obtenerPlanificacionesSemanaActual,
  obtenerPlanificacionesPorTipo,
  obtenerEstadisticasPlanificaciones,
  crearTemplatePlanificacion,
  obtenerTemplates,
  aplicarTemplate,
  TIPOS_PLANIFICACION,
  ESTADOS_TAREA,
  PRIORIDADES
};
