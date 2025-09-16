// Datos mock para desarrollo
let insumos = [
  {
    id: '1',
    nombre: 'Pollo',
    categoria: 'proteina',
    unidad: 'kg',
    precioActual: 1200,
    precioAnterior: 1100,
    proveedor: 'Carnicería Central',
    stockActual: 15,
    stockMinimo: 5,
    fechaUltimaCompra: new Date().toISOString(),
    fechaUltimoPrecio: new Date().toISOString(),
    activo: true,
    notas: 'Pollo fresco',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    nombre: 'Cebolla',
    categoria: 'vegetales',
    unidad: 'kg',
    precioActual: 300,
    precioAnterior: 280,
    proveedor: 'Verdulería del Barrio',
    stockActual: 8,
    stockMinimo: 3,
    fechaUltimaCompra: new Date().toISOString(),
    fechaUltimoPrecio: new Date().toISOString(),
    activo: true,
    notas: 'Cebolla blanca',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    nombre: 'Bolsa Vacío',
    categoria: 'envases',
    unidad: 'unidades',
    precioActual: 50,
    precioAnterior: 45,
    proveedor: 'Envases SA',
    stockActual: 2,
    stockMinimo: 10,
    fechaUltimaCompra: new Date().toISOString(),
    fechaUltimoPrecio: new Date().toISOString(),
    activo: true,
    notas: 'Bolsas para envasado al vacío',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let historialPrecios = [
  {
    id: '1',
    insumoId: '1',
    precio: 1100,
    fechaCambio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    motivo: 'compra',
    proveedor: 'Carnicería Central',
    cantidadComprada: 10,
    costoTotal: 11000,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    insumoId: '1',
    precio: 1200,
    fechaCambio: new Date().toISOString(),
    motivo: 'inflacion',
    proveedor: 'Carnicería Central',
    cantidadComprada: 15,
    costoTotal: 18000,
    createdAt: new Date().toISOString()
  }
];

export async function obtenerInsumos(filtros) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let insumosFiltrados = [...insumos];

  if (filtros) {
    if (filtros.categoria) {
      insumosFiltrados = insumosFiltrados.filter(i => i.categoria === filtros.categoria);
    }
    
    if (filtros.stockBajo) {
      insumosFiltrados = insumosFiltrados.filter(i => i.stockActual <= i.stockMinimo);
    }
    
    if (filtros.proveedor) {
      insumosFiltrados = insumosFiltrados.filter(i => 
        i.proveedor?.toLowerCase().includes(filtros.proveedor.toLowerCase())
      );
    }
    
    if (filtros.activos !== undefined) {
      insumosFiltrados = insumosFiltrados.filter(i => i.activo === filtros.activos);
    }
  }

  return insumosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export async function crearInsumo(insumo) {
  const nuevoInsumo = {
    ...insumo,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  insumos.push(nuevoInsumo);
  return nuevoInsumo;
}

export async function actualizarInsumo(id, actualizaciones) {
  const index = insumos.findIndex(i => i.id === id);
  if (index !== -1) {
    insumos[index] = {
      ...insumos[index],
      ...actualizaciones,
      updatedAt: new Date().toISOString()
    };
    return insumos[index];
  }
  return null;
}

export async function eliminarInsumo(id) {
  const index = insumos.findIndex(i => i.id === id);
  if (index !== -1) {
    insumos[index].activo = false;
    insumos[index].updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export async function actualizarPrecioInsumo(id, nuevoPrecio, motivo, proveedor, cantidadComprada) {
  const insumo = insumos.find(i => i.id === id);
  if (!insumo) return false;

  // Crear registro en historial
  const historial = {
    id: Date.now().toString(),
    insumoId: id,
    precio: nuevoPrecio,
    fechaCambio: new Date().toISOString(),
    motivo: motivo,
    proveedor,
    cantidadComprada,
    costoTotal: cantidadComprada ? nuevoPrecio * cantidadComprada : undefined,
    createdAt: new Date().toISOString()
  };

  historialPrecios.push(historial);

  // Actualizar insumo
  insumo.precioAnterior = insumo.precioActual;
  insumo.precioActual = nuevoPrecio;
  insumo.fechaUltimoPrecio = new Date().toISOString();
  
  if (cantidadComprada) {
    insumo.stockActual += cantidadComprada;
    insumo.fechaUltimaCompra = new Date().toISOString();
  }

  insumo.updatedAt = new Date().toISOString();

  return true;
}

export async function obtenerHistorialPrecios(insumoId) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return historialPrecios
    .filter(h => h.insumoId === insumoId)
    .sort((a, b) => new Date(b.fechaCambio).getTime() - new Date(a.fechaCambio).getTime());
}

export async function obtenerInsumosStockBajo() {
  return obtenerInsumos({ stockBajo: true, activos: true });
}



