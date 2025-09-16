// Importar servicio de usuarios y Supabase
import { obtenerUsuarioActual, obtenerNombreCompleto } from './usuariosService';
import { supabase, TABLES } from '../config/supabase';

// Datos mock para desarrollo - Iniciando con datos limpios
let insumos = [];

let historialPrecios = [];

export async function obtenerInsumos() {
  try {
    // Intentar obtener desde Supabase primero
    const { data, error } = await supabase
      .from(TABLES.INSUMOS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Si hay datos en Supabase, mapearlos al formato esperado por la interfaz
    if (data && data.length > 0) {
      return data.map(insumo => ({
        ...insumo,
        precioActual: insumo.precio_unitario, // Mapear precio_unitario a precioActual
        fechaUltimaCompra: insumo.fecha_ultima_compra, // Mapear fecha_ultima_compra
        fechaUltimoPrecio: insumo.fecha_ultimo_precio // Mapear fecha_ultimo_precio
      }));
    }
    
    // Si no hay datos en Supabase, usar datos locales
    return [...insumos].sort((a, b) => a.nombre.localeCompare(b.nombre));
  } catch (error) {
    console.error('Error obteniendo insumos desde Supabase, usando datos locales:', error);
    // En caso de error, usar datos locales
    return [...insumos].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
}

export async function obtenerInsumoPorId(id) {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  try {
    // Intentar obtener desde Supabase primero
    const { data, error } = await supabase
      .from(TABLES.INSUMOS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (data) {
      // Mapear al formato esperado por la interfaz
      return {
        ...data,
        precioActual: data.precio_unitario,
        fechaUltimaCompra: data.fecha_ultima_compra,
        fechaUltimoPrecio: data.fecha_ultimo_precio
      };
    }
  } catch (error) {
    console.error('Error obteniendo insumo desde Supabase, usando datos locales:', error);
  }
  
  // Fallback a datos locales
  return insumos.find(insumo => insumo.id === id);
}

export async function crearInsumo(insumo) {
  // Obtener usuario actual
  const usuarioActual = obtenerUsuarioActual();
  
  console.log('🔧 crearInsumo llamado con:', insumo);
  console.log('🔧 Usuario actual:', usuarioActual);
  
  const nuevoInsumo = {
    nombre: insumo.nombre,
    categoria: insumo.categoria,
    unidad: insumo.unidad,
    cantidad: parseFloat(insumo.cantidad) || 0,
    precio_unitario: parseFloat(insumo.precioActual) || 0,
    stock_actual: parseFloat(insumo.cantidad) || 0, // Usar cantidad como stock inicial
    stock_minimo: 0, // Valor por defecto
    proveedor: insumo.proveedor || null,
    descripcion: insumo.descripcion || null,
    fecha_ultima_compra: insumo.fechaUltimaCompra || null,
    fecha_ultimo_precio: new Date().toISOString(),
    usuario_id: usuarioActual?.id || null,
    usuario_nombre: usuarioActual ? obtenerNombreCompleto(usuarioActual) : 'Usuario no identificado',
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  try {
    console.log('🔧 Intentando guardar insumo en Supabase:', nuevoInsumo);
    
    // Intentar guardar en Supabase primero
    const { data, error } = await supabase
      .from(TABLES.INSUMOS)
      .insert([nuevoInsumo])
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }
    
    console.log('✅ Insumo guardado en Supabase:', data);
    return data;
  } catch (error) {
    console.error('❌ Error guardando en Supabase, guardando localmente:', error);
    
    // En caso de error, guardar localmente
    const insumoLocal = {
      ...nuevoInsumo,
      id: Date.now().toString()
    };
    
    insumos.unshift(insumoLocal);
    return insumoLocal;
  }
}

export async function actualizarInsumo(id, datosActualizacion) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    console.log('🔧 Intentando actualizar insumo con ID:', id);
    console.log('🔧 Datos de actualización:', datosActualizacion);
    
    // Mapear campos del formulario a campos de Supabase
    const datosMapeados = {
      ...datosActualizacion,
      precio_unitario: datosActualizacion.precioActual || datosActualizacion.precio_unitario,
      fecha_ultima_compra: datosActualizacion.fechaUltimaCompra || datosActualizacion.fecha_ultima_compra,
      updated_at: new Date().toISOString()
    };
    
    // Intentar actualizar en Supabase primero
    const { data, error } = await supabase
      .from(TABLES.INSUMOS)
      .update(datosMapeados)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }
    
    console.log('✅ Insumo actualizado en Supabase:', data);
    
    // Mapear respuesta al formato esperado por la interfaz
    return {
      ...data,
      precioActual: data.precio_unitario,
      fechaUltimaCompra: data.fecha_ultima_compra,
      fechaUltimoPrecio: data.fecha_ultimo_precio
    };
  } catch (error) {
    console.error('❌ Error actualizando en Supabase, intentando localmente:', error);
    
    // En caso de error, actualizar localmente
    const indice = insumos.findIndex(insumo => insumo.id === id);
    if (indice === -1) {
      throw new Error('Insumo no encontrado');
    }
    
    insumos[indice] = {
      ...insumos[indice],
      ...datosActualizacion,
      updatedAt: new Date().toISOString()
    };
    
    return insumos[indice];
  }
}

export async function eliminarInsumo(id) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    console.log('🔧 Intentando eliminar insumo con ID:', id);
    
    // Intentar eliminar desde Supabase primero
    const { data, error } = await supabase
      .from(TABLES.INSUMOS)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }
    
    console.log('✅ Insumo eliminado de Supabase:', data);
    return data;
  } catch (error) {
    console.error('❌ Error eliminando de Supabase, intentando localmente:', error);
    
    // En caso de error, intentar eliminar localmente
    const indice = insumos.findIndex(insumo => insumo.id === id);
    if (indice === -1) {
      throw new Error('Insumo no encontrado');
    }
    
    insumos[indice].activo = false;
    return insumos[indice];
  }
}

// Funciones para gestión de precios
export async function actualizarPrecioInsumo(id, nuevoPrecio, razon = '') {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const insumo = await obtenerInsumoPorId(id);
  if (!insumo) {
    throw new Error('Insumo no encontrado');
  }
  
  const precioAnterior = insumo.precioActual;
  
  // Actualizar precio del insumo
  insumos[insumos.findIndex(i => i.id === id)].precioActual = nuevoPrecio;
  insumos[insumos.findIndex(i => i.id === id)].precioAnterior = precioAnterior;
  insumos[insumos.findIndex(i => i.id === id)].fechaUltimoPrecio = new Date().toISOString();
  
  // Registrar en historial
  const entradaHistorial = {
    id: Date.now().toString(),
    insumoId: id,
    insumoNombre: insumo.nombre,
    precioAnterior,
    precioNuevo: nuevoPrecio,
    cambio: nuevoPrecio - precioAnterior,
    porcentajeCambio: ((nuevoPrecio - precioAnterior) / precioAnterior) * 100,
    razon,
    fecha: new Date().toISOString(),
    usuario: 'Sistema' // En un sistema real vendría del contexto de autenticación
  };
  
  historialPrecios.unshift(entradaHistorial);
  
  return entradaHistorial;
}

export async function obtenerHistorialPrecios(insumoId = null) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (insumoId) {
    return historialPrecios.filter(entrada => entrada.insumoId === insumoId);
  }
  
  return [...historialPrecios];
}

export async function obtenerInsumosPorCategoria(categoria) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return insumos.filter(insumo => insumo.categoria === categoria && insumo.activo);
}

export async function buscarInsumos(termino) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const terminoLimpio = termino.toLowerCase();
  return insumos.filter(insumo => 
    insumo.nombre.toLowerCase().includes(terminoLimpio) ||
    insumo.categoria.toLowerCase().includes(terminoLimpio) ||
    insumo.proveedor.toLowerCase().includes(terminoLimpio)
  );
}

export async function obtenerInsumosBajoStock() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return insumos.filter(insumo => 
    insumo.activo && insumo.stockActual <= insumo.stockMinimo
  );
}

export async function obtenerEstadisticasInsumos() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const totalInsumos = insumos.length;
  const insumosActivos = insumos.filter(i => i.activo).length;
  const insumosBajoStock = insumos.filter(i => i.activo && i.stockActual <= i.stockMinimo).length;
  const categorias = [...new Set(insumos.map(i => i.categoria))];
  
  const totalValorStock = insumos.reduce((total, insumo) => {
    return total + (insumo.stockActual * insumo.precioActual);
  }, 0);
  
  return {
    totalInsumos,
    insumosActivos,
    insumosBajoStock,
    categorias: categorias.length,
    totalValorStock,
    promedioPrecio: totalInsumos > 0 ? insumos.reduce((sum, i) => sum + i.precioActual, 0) / totalInsumos : 0
  };
}