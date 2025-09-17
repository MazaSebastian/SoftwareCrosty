// Recetas estandarizadas predefinidas
const recetasEstandarizadas = [
  {
    id: 'receta-001',
    nombre: 'Pollo Teriyaki',
    descripcion: 'Pollo marinado en salsa teriyaki, cocido al vacío',
    tipo: 'proteina',
    unidadBase: 'kg',
    cantidadBase: 1,
    rendimiento: 1, // 1kg de pollo = 1kg de producto final
    ingredientes: [
      { insumoId: 'pollo-pechuga', nombre: 'Pechuga de Pollo', cantidad: 1, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'salsa-teriyaki', nombre: 'Salsa Teriyaki', cantidad: 0.1, unidad: 'l', costoUnitario: 0 },
      { insumoId: 'aceite-oliva', nombre: 'Aceite de Oliva', cantidad: 0.05, unidad: 'l', costoUnitario: 0 },
      { insumoId: 'sal', nombre: 'Sal', cantidad: 0.01, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'pimienta', nombre: 'Pimienta', cantidad: 0.005, unidad: 'kg', costoUnitario: 0 }
    ],
    dificultad: 'media',
    activa: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'receta-002',
    nombre: 'Tartas de Jamón y Queso',
    descripcion: 'Tartas individuales de jamón y queso, masa casera',
    tipo: 'panificado',
    unidadBase: 'unidad',
    cantidadBase: 20,
    rendimiento: 20, // 20 tartas = 20 unidades
    ingredientes: [
      { insumoId: 'harina-000', nombre: 'Harina 000', cantidad: 0.5, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'manteca', nombre: 'Manteca', cantidad: 0.1, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'huevos', nombre: 'Huevos', cantidad: 2, unidad: 'unidad', costoUnitario: 0 },
      { insumoId: 'leche', nombre: 'Leche', cantidad: 0.2, unidad: 'l', costoUnitario: 0 },
      { insumoId: 'jamón', nombre: 'Jamón Cocido', cantidad: 0.3, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'queso-muzzarella', nombre: 'Queso Muzzarella', cantidad: 0.2, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'sal', nombre: 'Sal', cantidad: 0.01, unidad: 'kg', costoUnitario: 0 }
    ],
    dificultad: 'media',
    activa: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'receta-003',
    nombre: 'Empanadas de Carne',
    descripcion: 'Empanadas de carne molida con cebolla y especias',
    tipo: 'panificado',
    unidadBase: 'unidad',
    cantidadBase: 50,
    rendimiento: 50, // 50 empanadas = 50 unidades
    ingredientes: [
      { insumoId: 'harina-000', nombre: 'Harina 000', cantidad: 1, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'manteca', nombre: 'Manteca', cantidad: 0.2, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'carne-molida', nombre: 'Carne Molida', cantidad: 0.8, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'cebolla', nombre: 'Cebolla', cantidad: 0.3, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'huevos', nombre: 'Huevos', cantidad: 3, unidad: 'unidad', costoUnitario: 0 },
      { insumoId: 'aceite-oliva', nombre: 'Aceite de Oliva', cantidad: 0.1, unidad: 'l', costoUnitario: 0 },
      { insumoId: 'sal', nombre: 'Sal', cantidad: 0.02, unidad: 'kg', costoUnitario: 0 },
      { insumoId: 'pimienta', nombre: 'Pimienta', cantidad: 0.01, unidad: 'kg', costoUnitario: 0 }
    ],
    dificultad: 'alta',
    activa: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Datos mock para desarrollo - Iniciando con recetas estandarizadas
let recetas = [...recetasEstandarizadas];

export async function obtenerRecetas() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...recetas].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

// Función para obtener recetas con costos actualizados
export async function obtenerRecetasConCostos(insumos = []) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
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

export async function obtenerRecetaPorId(id) {
  await new Promise(resolve => setTimeout(resolve, 50));
  return recetas.find(receta => receta.id === id);
}

export async function crearReceta(receta) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const nuevaReceta = {
    ...receta,
    id: Date.now().toString(),
    activa: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  recetas.unshift(nuevaReceta);
  return nuevaReceta;
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
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const indice = recetas.findIndex(receta => receta.id === id);
  if (indice === -1) {
    throw new Error('Receta no encontrada');
  }
  
  // Eliminar la receta del array completamente
  const recetaEliminada = recetas.splice(indice, 1)[0];
  return recetaEliminada;
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

// Función para calcular costo de receta con precios actuales de insumos
export async function calcularCostoReceta(receta, insumos = []) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (!receta.ingredientes || receta.ingredientes.length === 0) {
    return 0;
  }
  
  const costoTotal = receta.ingredientes.reduce((total, ingrediente) => {
    // Buscar el insumo correspondiente para obtener el precio actual
    const insumo = insumos.find(i => i.id === ingrediente.insumoId || i.nombre === ingrediente.nombre);
    const precioUnitario = insumo ? insumo.precioActual || insumo.precio_unitario || 0 : ingrediente.costoUnitario || 0;
    
    return total + (ingrediente.cantidad * precioUnitario);
  }, 0);
  
  return costoTotal;
}

// Función para calcular costo por unidad
export async function calcularCostoPorUnidad(receta, insumos = []) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const costoTotal = await calcularCostoReceta(receta, insumos);
  const costoPorUnidad = costoTotal / receta.rendimiento;
  
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