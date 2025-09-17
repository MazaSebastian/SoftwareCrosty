import { stockSupabaseAdapter } from './stockSupabaseAdapter';

// Usar Supabase para productos de stock
export async function obtenerProductosStock(filtros) {
  try {
    return await stockSupabaseAdapter.obtenerProductosStock(filtros);
  } catch (error) {
    console.error('Error obteniendo productos de stock:', error);
    // Fallback a datos vacíos si hay error
    return [];
  }
}

export async function obtenerProductoPorId(id) {
  try {
    const productos = await stockSupabaseAdapter.obtenerProductosStock();
    return productos.find(producto => producto.id === id);
  } catch (error) {
    console.error('Error obteniendo producto por ID:', error);
    return null;
  }
}

export async function crearProducto(producto) {
  try {
    return await stockSupabaseAdapter.crearProductoStock(producto);
  } catch (error) {
    console.error('Error creando producto:', error);
    throw error;
  }
}

export async function actualizarProducto(id, datosActualizacion) {
  try {
    return await stockSupabaseAdapter.actualizarProductoStock(id, datosActualizacion);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    throw error;
  }
}

export async function eliminarProducto(id) {
  try {
    return await stockSupabaseAdapter.eliminarProductoStock(id);
  } catch (error) {
    console.error('Error eliminando producto:', error);
    throw error;
  }
}

export async function ajustarStock(id, cantidad, tipo = 'entrada', motivo = '') {
  try {
    const producto = await obtenerProductoPorId(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    const cantidadNumerica = parseInt(cantidad);
    let nuevaCantidad;
    
    if (tipo === 'entrada') {
      nuevaCantidad = producto.cantidad + cantidadNumerica;
    } else if (tipo === 'salida') {
      nuevaCantidad = producto.cantidad - cantidadNumerica;
      if (nuevaCantidad < 0) {
        throw new Error('Stock insuficiente');
      }
    } else {
      nuevaCantidad = cantidadNumerica;
    }
    
    return await stockSupabaseAdapter.actualizarProductoStock(id, { cantidad: nuevaCantidad });
  } catch (error) {
    console.error('Error ajustando stock:', error);
    throw error;
  }
}

export async function obtenerProductosBajoStock() {
  try {
    return await stockSupabaseAdapter.obtenerProductosStockBajo();
  } catch (error) {
    console.error('Error obteniendo productos con stock bajo:', error);
    return [];
  }
}

export async function obtenerProductosPorCategoria(categoria) {
  try {
    return await stockSupabaseAdapter.obtenerProductosPorCategoria(categoria);
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    return [];
  }
}

export async function buscarProductos(termino) {
  try {
    return await stockSupabaseAdapter.buscarProductos(termino);
  } catch (error) {
    console.error('Error buscando productos:', error);
    return [];
  }
}

export async function obtenerEstadisticasStock() {
  try {
    return await stockSupabaseAdapter.obtenerEstadisticasStock();
  } catch (error) {
    console.error('Error obteniendo estadísticas de stock:', error);
    return {
      totalProductos: 0,
      productosStockBajo: 0,
      categorias: 0,
      productosPorCategoria: []
    };
  }
}

export async function obtenerMovimientosStock(productoId = null) {
  // En un sistema real, esto vendría de una tabla de movimientos
  // Por ahora retornamos un array vacío
  return [];
}

// Funciones adicionales requeridas por Stock.jsx
export async function obtenerMovimientosRecientes() {
  // En un sistema real, esto vendría de una tabla de movimientos
  // Por ahora retornamos un array vacío
  return [];
}

export async function obtenerProductosStockBajo() {
  try {
    return await stockSupabaseAdapter.obtenerProductosStockBajo();
  } catch (error) {
    console.error('Error obteniendo productos con stock bajo:', error);
    return [];
  }
}

export async function crearProductoStock(producto) {
  try {
    return await stockSupabaseAdapter.crearProductoStock(producto);
  } catch (error) {
    console.error('Error creando producto de stock:', error);
    throw error;
  }
}

export async function actualizarProductoStock(id, datosActualizacion) {
  try {
    return await stockSupabaseAdapter.actualizarProductoStock(id, datosActualizacion);
  } catch (error) {
    console.error('Error actualizando producto de stock:', error);
    throw error;
  }
}

export async function registrarMovimientoStock(movimiento) {
  // En un sistema real, esto registraría el movimiento en una tabla
  // Por ahora solo retornamos el movimiento
  return {
    ...movimiento,
    id: Date.now().toString(),
    fecha: new Date().toISOString()
  };
}

export async function eliminarProductoStock(id) {
  try {
    return await stockSupabaseAdapter.eliminarProductoStock(id);
  } catch (error) {
    console.error('Error eliminando producto de stock:', error);
    throw error;
  }
}