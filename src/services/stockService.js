// Datos mock para desarrollo - Iniciando con datos limpios
let productosStock = [];

export async function obtenerProductosStock() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...productosStock].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export async function obtenerProductoPorId(id) {
  await new Promise(resolve => setTimeout(resolve, 50));
  return productosStock.find(producto => producto.id === id);
}

export async function crearProducto(producto) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const nuevoProducto = {
    ...producto,
    id: Date.now().toString(),
    stockActual: producto.stockActual || 0,
    activo: true,
    createdAt: new Date().toISOString()
  };
  
  productosStock.unshift(nuevoProducto);
  return nuevoProducto;
}

export async function actualizarProducto(id, datosActualizacion) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const indice = productosStock.findIndex(producto => producto.id === id);
  if (indice === -1) {
    throw new Error('Producto no encontrado');
  }
  
  productosStock[indice] = {
    ...productosStock[indice],
    ...datosActualizacion
  };
  
  return productosStock[indice];
}

export async function eliminarProducto(id) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const indice = productosStock.findIndex(producto => producto.id === id);
  if (indice === -1) {
    throw new Error('Producto no encontrado');
  }
  
  productosStock[indice].activo = false;
  return productosStock[indice];
}

export async function ajustarStock(id, cantidad, tipo = 'entrada', motivo = '') {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const producto = await obtenerProductoPorId(id);
  if (!producto) {
    throw new Error('Producto no encontrado');
  }
  
  const cantidadNumerica = parseInt(cantidad);
  let nuevoStock;
  
  if (tipo === 'entrada') {
    nuevoStock = producto.stockActual + cantidadNumerica;
  } else if (tipo === 'salida') {
    nuevoStock = producto.stockActual - cantidadNumerica;
    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente');
    }
  } else {
    nuevoStock = cantidadNumerica;
  }
  
  productosStock[productosStock.findIndex(p => p.id === id)].stockActual = nuevoStock;
  
  if (tipo === 'entrada') {
    productosStock[productosStock.findIndex(p => p.id === id)].fechaUltimaEntrada = new Date().toISOString();
  } else if (tipo === 'salida') {
    productosStock[productosStock.findIndex(p => p.id === id)].fechaUltimaSalida = new Date().toISOString();
  }
  
  return productosStock[productosStock.findIndex(p => p.id === id)];
}

export async function obtenerProductosBajoStock() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return productosStock.filter(producto => 
    producto.activo && producto.stockActual <= producto.stockMinimo
  );
}

export async function obtenerProductosPorCategoria(categoria) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return productosStock.filter(producto => producto.categoria === categoria && producto.activo);
}

export async function buscarProductos(termino) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const terminoLimpio = termino.toLowerCase();
  return productosStock.filter(producto => 
    producto.nombre.toLowerCase().includes(terminoLimpio) ||
    producto.categoria.toLowerCase().includes(terminoLimpio) ||
    producto.ubicacion.toLowerCase().includes(terminoLimpio)
  );
}

export async function obtenerEstadisticasStock() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const totalProductos = productosStock.length;
  const productosActivos = productosStock.filter(p => p.activo).length;
  const productosBajoStock = productosStock.filter(p => p.activo && p.stockActual <= p.stockMinimo).length;
  const categorias = [...new Set(productosStock.map(p => p.categoria))];
  
  const totalValorStock = productosStock.reduce((total, producto) => {
    return total + (producto.stockActual * (producto.costoUnitario || 0));
  }, 0);
  
  const totalValorVenta = productosStock.reduce((total, producto) => {
    return total + (producto.stockActual * (producto.precioVenta || 0));
  }, 0);
  
  return {
    totalProductos,
    productosActivos,
    productosBajoStock,
    categorias: categorias.length,
    totalValorStock,
    totalValorVenta,
    potencialGanancia: totalValorVenta - totalValorStock
  };
}

export async function obtenerMovimientosStock(productoId = null) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // En un sistema real, esto vendría de una tabla de movimientos
  // Por ahora retornamos un array vacío
  return [];
}

// Funciones adicionales requeridas por Stock.jsx
export async function obtenerMovimientosRecientes() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [];
}

export async function obtenerProductosStockBajo() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return productosStock.filter(producto => 
    producto.activo && producto.stockActual <= producto.stockMinimo
  );
}

export async function crearProductoStock(producto) {
  return await crearProducto(producto);
}

export async function registrarMovimientoStock(movimiento) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // En un sistema real, esto registraría el movimiento en una tabla
  // Por ahora solo retornamos el movimiento
  return {
    ...movimiento,
    id: Date.now().toString(),
    fecha: new Date().toISOString()
  };
}

export async function eliminarProductoStock(id) {
  return await eliminarProducto(id);
}