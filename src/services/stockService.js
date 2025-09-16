// Datos mock para desarrollo
let productosStock = [
  {
    id: '1',
    nombre: 'Tarta de Pollo',
    categoria: 'Tartas Saladas',
    stockActual: 15,
    stockMinimo: 5,
    stockMaximo: 50,
    precioVenta: 500,
    costoUnitario: 200,
    ubicacion: 'Freezer A',
    fechaUltimaEntrada: new Date().toISOString(),
    fechaUltimaSalida: new Date(Date.now() - 86400000).toISOString(),
    activo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    nombre: 'Tarta de Verdura',
    categoria: 'Tartas Saladas',
    stockActual: 8,
    stockMinimo: 5,
    stockMaximo: 40,
    precioVenta: 450,
    costoUnitario: 180,
    ubicacion: 'Freezer A',
    fechaUltimaEntrada: new Date(Date.now() - 172800000).toISOString(),
    fechaUltimaSalida: new Date(Date.now() - 43200000).toISOString(),
    activo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    nombre: 'Pollo BBQ',
    categoria: 'Pollos Condimentados',
    stockActual: 12,
    stockMinimo: 3,
    stockMaximo: 30,
    precioVenta: 800,
    costoUnitario: 400,
    ubicacion: 'Freezer B',
    fechaUltimaEntrada: new Date(Date.now() - 259200000).toISOString(),
    fechaUltimaSalida: new Date(Date.now() - 86400000).toISOString(),
    activo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    nombre: 'Pollo con Hierbas',
    categoria: 'Pollos Condimentados',
    stockActual: 2,
    stockMinimo: 3,
    stockMaximo: 25,
    precioVenta: 750,
    costoUnitario: 350,
    ubicacion: 'Freezer B',
    fechaUltimaEntrada: new Date(Date.now() - 345600000).toISOString(),
    fechaUltimaSalida: new Date(Date.now() - 172800000).toISOString(),
    activo: true,
    createdAt: new Date().toISOString()
  }
];

let movimientosStock = [
  {
    id: '1',
    productoId: '1',
    productoNombre: 'Tarta de Pollo',
    tipo: 'entrada',
    cantidad: 20,
    motivo: 'Producción',
    usuarioId: 'socio1',
    usuarioNombre: 'Socio 1',
    fecha: new Date().toISOString(),
    stockAnterior: 0,
    stockNuevo: 20,
    notas: 'Lote de producción #001'
  },
  {
    id: '2',
    productoId: '1',
    productoNombre: 'Tarta de Pollo',
    tipo: 'salida',
    cantidad: 5,
    motivo: 'Venta',
    usuarioId: 'socio1',
    usuarioNombre: 'Socio 1',
    fecha: new Date(Date.now() - 86400000).toISOString(),
    stockAnterior: 20,
    stockNuevo: 15,
    notas: 'Venta a cliente'
  },
  {
    id: '3',
    productoId: '4',
    productoNombre: 'Pollo con Hierbas',
    tipo: 'salida',
    cantidad: 3,
    motivo: 'Venta',
    usuarioId: 'socio2',
    usuarioNombre: 'Socio 2',
    fecha: new Date(Date.now() - 172800000).toISOString(),
    stockAnterior: 5,
    stockNuevo: 2,
    notas: 'Venta a cliente'
  }
];

export async function obtenerProductosStock() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...productosStock].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export async function obtenerProductoStockPorId(id) {
  await new Promise(resolve => setTimeout(resolve, 50));
  return productosStock.find(p => p.id === id);
}

export async function crearProductoStock(producto) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const nuevoProducto = {
    ...producto,
    id: Date.now().toString(),
    stockActual: producto.stockActual || 0,
    fechaUltimaEntrada: null,
    fechaUltimaSalida: null,
    activo: true,
    createdAt: new Date().toISOString()
  };
  
  productosStock.push(nuevoProducto);
  return nuevoProducto;
}

export async function actualizarProductoStock(id, datosActualizados) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const index = productosStock.findIndex(p => p.id === id);
  if (index !== -1) {
    productosStock[index] = {
      ...productosStock[index],
      ...datosActualizados,
      updatedAt: new Date().toISOString()
    };
    return productosStock[index];
  }
  return null;
}

export async function eliminarProductoStock(id) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const index = productosStock.findIndex(p => p.id === id);
  if (index !== -1) {
    productosStock.splice(index, 1);
    return true;
  }
  return false;
}

export async function obtenerMovimientosStock(filtros) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let movimientosFiltrados = [...movimientosStock];

  if (filtros) {
    if (filtros.productoId) {
      movimientosFiltrados = movimientosFiltrados.filter(m => m.productoId === filtros.productoId);
    }
    
    if (filtros.tipo) {
      movimientosFiltrados = movimientosFiltrados.filter(m => m.tipo === filtros.tipo);
    }
    
    if (filtros.fechaInicio) {
      movimientosFiltrados = movimientosFiltrados.filter(m => 
        new Date(m.fecha) >= new Date(filtros.fechaInicio)
      );
    }
    
    if (filtros.fechaFin) {
      movimientosFiltrados = movimientosFiltrados.filter(m => 
        new Date(m.fecha) <= new Date(filtros.fechaFin)
      );
    }
  }

  return movimientosFiltrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export async function registrarMovimientoStock(movimiento) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const producto = productosStock.find(p => p.id === movimiento.productoId);
  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  const stockAnterior = producto.stockActual;
  let stockNuevo = stockAnterior;

  switch (movimiento.tipo) {
    case 'entrada':
      stockNuevo = stockAnterior + movimiento.cantidad;
      producto.fechaUltimaEntrada = new Date().toISOString();
      break;
    case 'salida':
      if (stockAnterior < movimiento.cantidad) {
        throw new Error('Stock insuficiente');
      }
      stockNuevo = stockAnterior - movimiento.cantidad;
      producto.fechaUltimaSalida = new Date().toISOString();
      break;
    case 'ajuste':
      stockNuevo = movimiento.cantidad;
      break;
    default:
      throw new Error('Tipo de movimiento inválido');
  }

  // Actualizar stock del producto
  producto.stockActual = stockNuevo;

  // Crear movimiento
  const nuevoMovimiento = {
    ...movimiento,
    id: Date.now().toString(),
    stockAnterior,
    stockNuevo,
    fecha: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  movimientosStock.unshift(nuevoMovimiento);
  return nuevoMovimiento;
}

export async function obtenerProductosStockBajo() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return productosStock.filter(p => p.stockActual <= p.stockMinimo && p.activo);
}

export async function obtenerEstadisticasStock() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const productosActivos = productosStock.filter(p => p.activo);
  const productosStockBajo = productosActivos.filter(p => p.stockActual <= p.stockMinimo);
  
  const valorTotalStock = productosActivos.reduce((sum, p) => 
    sum + (p.stockActual * p.costoUnitario), 0
  );
  
  const valorTotalVenta = productosActivos.reduce((sum, p) => 
    sum + (p.stockActual * p.precioVenta), 0
  );

  return {
    totalProductos: productosActivos.length,
    productosStockBajo: productosStockBajo.length,
    valorTotalStock,
    valorTotalVenta,
    margenTotal: valorTotalVenta - valorTotalStock,
    productosPorCategoria: productosActivos.reduce((acc, p) => {
      acc[p.categoria] = (acc[p.categoria] || 0) + 1;
      return acc;
    }, {}),
    stockPorCategoria: productosActivos.reduce((acc, p) => {
      if (!acc[p.categoria]) {
        acc[p.categoria] = { cantidad: 0, valor: 0 };
      }
      acc[p.categoria].cantidad += p.stockActual;
      acc[p.categoria].valor += p.stockActual * p.costoUnitario;
      return acc;
    }, {})
  };
}

export async function obtenerMovimientosRecientes(limite = 10) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return movimientosStock.slice(0, limite);
}

export async function ajustarStock(productoId, nuevaCantidad, motivo, notas) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const producto = productosStock.find(p => p.id === productoId);
  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  const stockAnterior = producto.stockActual;
  
  // Actualizar stock del producto
  producto.stockActual = nuevaCantidad;

  // Crear movimiento de ajuste
  const movimiento = {
    id: Date.now().toString(),
    productoId,
    productoNombre: producto.nombre,
    tipo: 'ajuste',
    cantidad: nuevaCantidad,
    motivo: motivo || 'Ajuste de inventario',
    usuarioId: 'socio1',
    usuarioNombre: 'Socio 1',
    fecha: new Date().toISOString(),
    stockAnterior,
    stockNuevo: nuevaCantidad,
    notas: notas || '',
    createdAt: new Date().toISOString()
  };

  movimientosStock.unshift(movimiento);
  return movimiento;
}

export async function obtenerHistorialStock(productoId) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return movimientosStock.filter(m => m.productoId === productoId);
}



