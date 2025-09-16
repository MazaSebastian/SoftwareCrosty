// Datos mock para desarrollo - Iniciando con datos limpios
let recetas = [];

export async function obtenerRecetas() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...recetas].sort((a, b) => a.nombre.localeCompare(b.nombre));
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
  
  recetas[indice].activa = false;
  return recetas[indice];
}

export async function calcularCostoReceta(receta) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (!receta.ingredientes || receta.ingredientes.length === 0) {
    return 0;
  }
  
  const costoTotal = receta.ingredientes.reduce((total, ingrediente) => {
    return total + (ingrediente.cantidad * ingrediente.costoUnitario);
  }, 0);
  
  return costoTotal;
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