// Importar servicio de usuarios y Supabase
import { obtenerUsuarioActual, obtenerNombreCompleto } from './usuariosService';
import { supabase, TABLES } from '../config/supabase';

// Datos mock para desarrollo - Iniciando con datos limpios
let recetas = [];

export async function obtenerRecetas() {
  try {
    // Intentar obtener desde Supabase primero
    const { data, error } = await supabase
      .from(TABLES.RECETAS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Si hay datos en Supabase, usarlos
    if (data && data.length > 0) {
      return data;
    }
    
    // Si no hay datos en Supabase, usar datos locales
    return [...recetas].sort((a, b) => a.nombre.localeCompare(b.nombre));
  } catch (error) {
    console.error('Error obteniendo recetas desde Supabase, usando datos locales:', error);
    // En caso de error, usar datos locales
    return [...recetas].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
}

// Función para obtener recetas con costos actualizados
export async function obtenerRecetasConCostos(insumos = []) {
  try {
    console.log('🔧 obtenerRecetasConCostos iniciado');
    
    // Obtener recetas desde Supabase primero
    const recetasData = await obtenerRecetas();
    console.log('🔧 Recetas obtenidas:', recetasData);
    
    const recetasConCostos = await Promise.all(
      recetasData.map(async (receta) => {
        const costoTotal = await calcularCostoReceta(receta, insumos);
        const costoPorUnidad = await calcularCostoPorUnidad(receta, insumos);
        
        return {
          ...receta,
          costoTotal,
          costoPorUnidad,
          costoPorUnidadFormateado: `$${costoPorUnidad.toFixed(2)} por ${receta.unidad_base || receta.unidadBase || 'unidad'}`
        };
      })
    );
    
    console.log('🔧 Recetas con costos calculados:', recetasConCostos);
    return recetasConCostos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } catch (error) {
    console.error('❌ Error en obtenerRecetasConCostos:', error);
    // Fallback a datos locales
    const recetasConCostos = await Promise.all(
      recetas.map(async (receta) => {
        const costoTotal = await calcularCostoReceta(receta, insumos);
        const costoPorUnidad = await calcularCostoPorUnidad(receta, insumos);
        
        return {
          ...receta,
          costoTotal,
          costoPorUnidad,
          costoPorUnidadFormateado: `$${costoPorUnidad.toFixed(2)} por ${receta.unidadBase}`
        };
      })
    );
    
    return recetasConCostos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
}

export async function obtenerRecetaPorId(id) {
  try {
    // Intentar obtener desde Supabase primero
    const { data, error } = await supabase
      .from(TABLES.RECETAS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (data) {
      return data;
    }
  } catch (error) {
    console.error('Error obteniendo receta desde Supabase, usando datos locales:', error);
  }
  
  // Fallback a datos locales
  return recetas.find(receta => receta.id === id);
}

export async function crearReceta(receta) {
  // Obtener usuario actual
  const usuarioActual = obtenerUsuarioActual();
  
  console.log('🔧 crearReceta llamado con:', receta);
  console.log('🔧 Usuario actual:', usuarioActual);
  
  const nuevaReceta = {
    nombre: receta.nombre,
    descripcion: receta.descripcion || null,
    categoria: receta.categoria,
    tipo: receta.tipo || 'general',
    cantidad_base: parseFloat(receta.cantidadBase) || 1,
    rendimiento: parseFloat(receta.rendimiento) || 1,
    unidad_base: receta.unidadBase || 'unidad',
    ingredientes: receta.ingredientes || [],
    instrucciones: receta.instrucciones || null,
    tiempo_preparacion: receta.tiempoPreparacion || null,
    dificultad: receta.dificultad || 'media',
    costo_total_ingredientes: 0, // Se calculará después
    precio_venta: receta.precioVenta || null,
    margen_ganancia: receta.margenGanancia || 0.3,
    activa: true,
    usuario_id: usuarioActual?.id || null,
    usuario_nombre: usuarioActual ? obtenerNombreCompleto(usuarioActual) : 'Usuario no identificado',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  try {
    console.log('🔧 Intentando guardar receta en Supabase:', nuevaReceta);
    
    // Intentar guardar en Supabase primero
    const { data, error } = await supabase
      .from(TABLES.RECETAS)
      .insert([nuevaReceta])
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }
    
    console.log('✅ Receta guardada en Supabase:', data);
    return data;
  } catch (error) {
    console.error('❌ Error guardando en Supabase, guardando localmente:', error);
    
    // En caso de error, guardar localmente
    const recetaLocal = {
      ...nuevaReceta,
      id: Date.now().toString(),
      createdAt: nuevaReceta.created_at,
      updatedAt: nuevaReceta.updated_at
    };
    
    recetas.unshift(recetaLocal);
    return recetaLocal;
  }
}

export async function actualizarReceta(id, datosActualizacion) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const indice = recetas.findIndex(receta => receta.id === id);
  if (indice === -1) {
    throw new Error('Receta no encontrada');
  }
  
  recetas[indice] = {
    ...recetas[indice],
    ...datosActualizacion,
    updatedAt: new Date().toISOString()
  };
  
  return recetas[indice];
}

export async function eliminarReceta(id) {
  try {
    console.log('🔧 Intentando eliminar receta con ID:', id);
    
    // Intentar eliminar desde Supabase primero
    const { data, error } = await supabase
      .from(TABLES.RECETAS)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }
    
    console.log('✅ Receta eliminada de Supabase:', data);
    return data;
  } catch (error) {
    console.error('❌ Error eliminando de Supabase, intentando localmente:', error);
    
    // En caso de error, intentar eliminar localmente
    const indice = recetas.findIndex(receta => receta.id === id);
    if (indice === -1) {
      throw new Error('Receta no encontrada');
    }
    
    // Eliminar la receta del array completamente
    const recetaEliminada = recetas.splice(indice, 1)[0];
    return recetaEliminada;
  }
}

// Función para escalar una receta a una cantidad deseada
export async function escalarReceta(receta, cantidadDeseada) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (!receta || !receta.ingredientes) {
    throw new Error('Receta inválida');
  }
  
  // Calcular factor de escalado
  const factorEscalado = cantidadDeseada / receta.cantidadBase;
  
  // Escalar ingredientes
  const ingredientesEscalados = receta.ingredientes.map(ingrediente => ({
    ...ingrediente,
    cantidad: ingrediente.cantidad * factorEscalado
  }));
  
  // Crear receta escalada
  const recetaEscalada = {
    ...receta,
    id: `${receta.id}-escalada-${Date.now()}`,
    cantidadBase: cantidadDeseada,
    rendimiento: cantidadDeseada,
    ingredientes: ingredientesEscalados,
    factorEscalado: factorEscalado,
    createdAt: new Date().toISOString()
  };
  
  return recetaEscalada;
}

// Función para convertir unidades y calcular costo
function convertirUnidades(cantidad, unidadOrigen, unidadDestino, precioUnitario) {
  // Casos especiales de conversión
  if (unidadOrigen === 'unidad' && unidadDestino === 'maple') {
    // Si el insumo se vende por maple (30 unidades) pero la receta usa unidades individuales
    const precioPorUnidad = precioUnitario / 30; // $5.690 ÷ 30 = $189.67 por huevo
    return cantidad * precioPorUnidad;
  }
  
  if (unidadOrigen === 'maple' && unidadDestino === 'unidad') {
    // Si el insumo se vende por unidad pero la receta usa maples
    return cantidad * precioUnitario * 30;
  }
  
  // Conversiones de peso
  if (unidadOrigen === 'g' && unidadDestino === 'kg') {
    return (cantidad / 1000) * precioUnitario;
  }
  
  if (unidadOrigen === 'kg' && unidadDestino === 'g') {
    return (cantidad * 1000) * precioUnitario;
  }
  
  // Conversiones de volumen
  if (unidadOrigen === 'ml' && unidadDestino === 'l') {
    return (cantidad / 1000) * precioUnitario;
  }
  
  if (unidadOrigen === 'l' && unidadDestino === 'ml') {
    return (cantidad * 1000) * precioUnitario;
  }
  
  // Si no hay conversión específica, usar cálculo directo
  return cantidad * precioUnitario;
}

// Función para calcular costo de receta con precios actuales de insumos
export async function calcularCostoReceta(receta, insumos = []) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log('🔧 calcularCostoReceta iniciado para:', receta.nombre);
  console.log('🔧 Insumos disponibles:', insumos.length);
  console.log('🔧 Insumos:', insumos.map(i => ({ nombre: i.nombre, precio: i.precioActual || i.precio_unitario, unidad: i.unidad })));
  
  if (!receta.ingredientes || receta.ingredientes.length === 0) {
    console.log('❌ No hay ingredientes en la receta');
    return 0;
  }
  
  console.log('🔧 Ingredientes de la receta:', receta.ingredientes);
  
  const costoTotal = receta.ingredientes.reduce((total, ingrediente) => {
    // Buscar el insumo correspondiente para obtener el precio actual
    const insumo = insumos.find(i => i.id === ingrediente.insumoId || i.nombre === ingrediente.nombre);
    const precioUnitario = insumo ? insumo.precioActual || insumo.precio_unitario || 0 : ingrediente.costoUnitario || 0;
    
    console.log(`🔧 Procesando ingrediente: ${ingrediente.nombre || ingrediente.insumoNombre}`);
    console.log(`🔧 Insumo encontrado:`, insumo ? { nombre: insumo.nombre, precio: insumo.precioActual || insumo.precio_unitario, unidad: insumo.unidad } : 'NO ENCONTRADO');
    console.log(`🔧 Precio unitario usado: ${precioUnitario}`);
    
    // Calcular el costo considerando las unidades del insumo
    let costoIngrediente = 0;
    
    if (insumo && insumo.unidad && ingrediente.unidad) {
      // Si las unidades coinciden, usar directamente
      if (insumo.unidad === ingrediente.unidad) {
        costoIngrediente = ingrediente.cantidad * precioUnitario;
        console.log(`🔧 Unidades coinciden: ${ingrediente.cantidad} × ${precioUnitario} = ${costoIngrediente}`);
      } else {
        // Convertir unidades si es necesario
        costoIngrediente = convertirUnidades(ingrediente.cantidad, ingrediente.unidad, insumo.unidad, precioUnitario);
        console.log(`🔧 Conversión de unidades: ${ingrediente.cantidad}${ingrediente.unidad} → ${insumo.unidad} = ${costoIngrediente}`);
      }
    } else {
      // Fallback: usar cálculo directo
      costoIngrediente = ingrediente.cantidad * precioUnitario;
      console.log(`🔧 Fallback directo: ${ingrediente.cantidad} × ${precioUnitario} = ${costoIngrediente}`);
    }
    
    console.log(`🔧 Cálculo ingrediente ${ingrediente.nombre || ingrediente.insumoNombre}:`, {
      cantidad: ingrediente.cantidad,
      unidad: ingrediente.unidad,
      precioUnitario,
      costoIngrediente,
      insumoUnidad: insumo?.unidad,
      insumoPrecioActual: insumo?.precioActual,
      insumoPrecioUnitario: insumo?.precio_unitario,
      insumoCompleto: insumo
    });
    
    return total + costoIngrediente;
  }, 0);
  
  console.log(`🔧 Costo total de receta ${receta.nombre}: $${costoTotal}`);
  
  return costoTotal;
}

// Función para calcular costo por unidad
export async function calcularCostoPorUnidad(receta, insumos = []) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const costoTotal = await calcularCostoReceta(receta, insumos);
  const rendimiento = receta.rendimiento || receta.cantidad_base || 1;
  const costoPorUnidad = costoTotal / rendimiento;
  
  return costoPorUnidad;
}

export async function calcularPrecioVenta(costoTotal, margenGanancia = 0.3) {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return costoTotal * (1 + margenGanancia);
}

export async function obtenerRecetasPorTipo(tipo) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return recetas.filter(receta => receta.tipo === tipo && receta.activa);
}

export async function buscarRecetas(termino) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const terminoLimpio = termino.toLowerCase();
  return recetas.filter(receta => 
    receta.nombre.toLowerCase().includes(terminoLimpio) ||
    receta.descripcion.toLowerCase().includes(terminoLimpio) ||
    receta.tipo.toLowerCase().includes(terminoLimpio)
  );
}

export async function obtenerEstadisticasRecetas() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const totalRecetas = recetas.length;
  const recetasActivas = recetas.filter(r => r.activa).length;
  const tipos = [...new Set(recetas.map(r => r.tipo))];
  
  const costoPromedio = totalRecetas > 0 ? 
    recetas.reduce((sum, r) => sum + (r.costoTotalIngredientes || 0), 0) / totalRecetas : 0;
  
  const precioPromedio = totalRecetas > 0 ? 
    recetas.reduce((sum, r) => sum + (r.precioVenta || 0), 0) / totalRecetas : 0;
  
  const margenPromedio = totalRecetas > 0 ? 
    recetas.reduce((sum, r) => sum + (r.margenGanancia || 0), 0) / totalRecetas : 0;
  
  return {
    totalRecetas,
    recetasActivas,
    tipos: tipos.length,
    costoPromedio,
    precioPromedio,
    margenPromedio
  };
}

export async function duplicarReceta(id) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const recetaOriginal = await obtenerRecetaPorId(id);
  if (!recetaOriginal) {
    throw new Error('Receta no encontrada');
  }
  
  const nuevaReceta = {
    ...recetaOriginal,
    id: Date.now().toString(),
    nombre: `${recetaOriginal.nombre} (Copia)`,
    activa: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  recetas.unshift(nuevaReceta);
  return nuevaReceta;
}