// Datos mock para desarrollo
let producciones = [
  {
    id: '1',
    fecha: new Date().toISOString(),
    recetaId: 'receta1',
    recetaNombre: 'Tarta de Pollo',
    cantidadProducida: 8,
    costoTotal: 1400,
    costoUnitario: 175,
    estado: 'completada',
    usuarioId: 'socio1',
    usuarioNombre: 'Socio 1',
    notas: 'Producción exitosa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    fecha: new Date().toISOString(),
    recetaId: 'receta2',
    recetaNombre: 'Pollo BBQ',
    cantidadProducida: 6,
    costoTotal: 2450,
    costoUnitario: 408.33,
    estado: 'en_proceso',
    usuarioId: 'socio2',
    usuarioNombre: 'Socio 2',
    notas: 'En proceso de envasado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function obtenerProducciones() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...producciones].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export async function crearProduccion(produccion) {
  const nuevaProduccion = {
    ...produccion,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  producciones.unshift(nuevaProduccion);
  return nuevaProduccion;
}

export async function actualizarProduccion(id, actualizaciones) {
  const index = producciones.findIndex(p => p.id === id);
  if (index !== -1) {
    producciones[index] = {
      ...producciones[index],
      ...actualizaciones,
      updatedAt: new Date().toISOString()
    };
    return producciones[index];
  }
  return null;
}

export async function eliminarProduccion(id) {
  const index = producciones.findIndex(p => p.id === id);
  if (index !== -1) {
    producciones.splice(index, 1);
    return true;
  }
  return false;
}



