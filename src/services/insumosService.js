// Datos mock para desarrollo - Iniciando con datos limpios
let insumos = [];

let historialPrecios = [];

export async function obtenerInsumos() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...insumos].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export async function obtenerInsumoPorId(id) {
  await new Promise(resolve => setTimeout(resolve, 50));
  return insumos.find(insumo => insumo.id === id);
}

export async function crearInsumo(insumo) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const nuevoInsumo = {
    ...insumo,
    id: Date.now().toString(),
    fechaUltimaCompra: null,
    fechaUltimoPrecio: new Date().toISOString(),
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  insumos.unshift(nuevoInsumo);
  return nuevoInsumo;
}

export async function actualizarInsumo(id, datosActualizacion) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
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

export async function eliminarInsumo(id) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const indice = insumos.findIndex(insumo => insumo.id === id);
  if (indice === -1) {
    throw new Error('Insumo no encontrado');
  }
  
  insumos[indice].activo = false;
  return insumos[indice];
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