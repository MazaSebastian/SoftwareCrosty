// Datos mock para desarrollo
let recetas = [
  {
    id: '1',
    nombre: 'Tarta de Pollo',
    tipo: 'tarta_salada',
    descripcion: 'Tarta salada con pollo, cebolla y condimentos',
    ingredientes: [
      {
        insumoId: '1',
        insumoNombre: 'Pollo',
        cantidad: 1,
        unidad: 'kg',
        costoUnitario: 1200,
        costoTotal: 1200
      },
      {
        insumoId: '2',
        insumoNombre: 'Cebolla',
        cantidad: 0.5,
        unidad: 'kg',
        costoUnitario: 300,
        costoTotal: 150
      },
      {
        insumoId: '3',
        insumoNombre: 'Bolsa Vacío',
        cantidad: 1,
        unidad: 'unidades',
        costoUnitario: 50,
        costoTotal: 50
      }
    ],
    costoTotalIngredientes: 1400,
    rendimiento: 8,
    costoPorPorcion: 175,
    precioVenta: 500,
    margenGanancia: 325,
    tiempoPreparacion: 45,
    instrucciones: '1. Cocinar el pollo\n2. Saltear la cebolla\n3. Mezclar ingredientes\n4. Envasar al vacío',
    activa: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    nombre: 'Pollo BBQ',
    tipo: 'pollo_condimentado',
    descripcion: 'Pollo troceado con salsa BBQ',
    ingredientes: [
      {
        insumoId: '1',
        insumoNombre: 'Pollo',
        cantidad: 2,
        unidad: 'kg',
        costoUnitario: 1200,
        costoTotal: 2400
      },
      {
        insumoId: '3',
        insumoNombre: 'Bolsa Vacío',
        cantidad: 1,
        unidad: 'unidades',
        costoUnitario: 50,
        costoTotal: 50
      }
    ],
    costoTotalIngredientes: 2450,
    rendimiento: 6,
    costoPorPorcion: 408.33,
    precioVenta: 800,
    margenGanancia: 391.67,
    tiempoPreparacion: 30,
    instrucciones: '1. Trocear el pollo\n2. Agregar salsa BBQ\n3. Envasar al vacío',
    activa: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function obtenerRecetas() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...recetas].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export async function obtenerRecetasActivas() {
  const todasLasRecetas = await obtenerRecetas();
  return todasLasRecetas.filter(r => r.activa);
}

export async function obtenerRecetaPorId(id) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return recetas.find(r => r.id === id) || null;
}

export async function crearReceta(receta) {
  const nuevaReceta = {
    ...receta,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  recetas.push(nuevaReceta);
  return nuevaReceta;
}

export async function actualizarReceta(id, actualizaciones) {
  const index = recetas.findIndex(r => r.id === id);
  if (index !== -1) {
    recetas[index] = {
      ...recetas[index],
      ...actualizaciones,
      updatedAt: new Date().toISOString()
    };
    return recetas[index];
  }
  return null;
}

export async function eliminarReceta(id) {
  const index = recetas.findIndex(r => r.id === id);
  if (index !== -1) {
    recetas[index].activa = false;
    recetas[index].updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export async function calcularCostoReceta(ingredientes) {
  return ingredientes.reduce((total, ingrediente) => total + ingrediente.costoTotal, 0);
}

export async function calcularCostoPorPorcion(costoTotal, rendimiento) {
  return rendimiento > 0 ? costoTotal / rendimiento : 0;
}

export async function calcularMargenGanancia(costoPorPorcion, precioVenta) {
  return precioVenta - costoPorPorcion;
}



