// Servicio mejorado para cálculo de costos de recetas
// Maneja conversiones de unidades y proporciones correctamente

// Función para convertir unidades a la unidad base del insumo
export function convertirACantidadBase(cantidad, unidadOrigen, unidadDestino) {
  // Si las unidades ya coinciden, no hay conversión
  if (unidadOrigen === unidadDestino) {
    return cantidad;
  }

  // Conversiones de peso
  const conversionesPeso = {
    'g': { 'kg': 0.001, 'g': 1 },
    'kg': { 'g': 1000, 'kg': 1 }
  };

  // Conversiones de volumen
  const conversionesVolumen = {
    'ml': { 'l': 0.001, 'ml': 1 },
    'l': { 'ml': 1000, 'l': 1 }
  };

  // Conversiones especiales
  const conversionesEspeciales = {
    'unidad': { 'maple': 1/30, 'unidad': 1 }, // 30 unidades = 1 maple
    'maple': { 'unidad': 30, 'maple': 1 }
  };

  // Buscar conversión en peso
  if (conversionesPeso[unidadOrigen] && conversionesPeso[unidadOrigen][unidadDestino]) {
    return cantidad * conversionesPeso[unidadOrigen][unidadDestino];
  }

  // Buscar conversión en volumen
  if (conversionesVolumen[unidadOrigen] && conversionesVolumen[unidadOrigen][unidadDestino]) {
    return cantidad * conversionesVolumen[unidadOrigen][unidadDestino];
  }

  // Buscar conversión especial
  if (conversionesEspeciales[unidadOrigen] && conversionesEspeciales[unidadOrigen][unidadDestino]) {
    return cantidad * conversionesEspeciales[unidadOrigen][unidadDestino];
  }

  // Si no hay conversión específica, asumir que son equivalentes
  console.warn(`No se encontró conversión de ${unidadOrigen} a ${unidadDestino}, usando 1:1`);
  return cantidad;
}

// Función para calcular el precio unitario del insumo
export function calcularPrecioUnitario(insumo) {
  if (!insumo) return 0;

  // Obtener el precio actual (puede venir de diferentes campos)
  const precioTotal = insumo.precioActual || insumo.precio_unitario || insumo.precio || 0;
  const cantidadComprada = insumo.cantidad || insumo.cantidadComprada || 1;
  const unidadComprada = insumo.unidad || insumo.unidadComprada || 'unidad';

  // Si no hay cantidad especificada, asumir que el precio es por unidad
  if (!cantidadComprada || cantidadComprada <= 0) {
    return precioTotal;
  }

  // Calcular precio por unidad base
  const precioPorUnidad = precioTotal / cantidadComprada;

  console.log(`🔧 Cálculo precio unitario para ${insumo.nombre}:`, {
    precioTotal,
    cantidadComprada,
    unidadComprada,
    precioPorUnidad
  });

  return precioPorUnidad;
}

// Función para calcular el costo de un ingrediente específico
export function calcularCostoIngrediente(ingrediente, insumo) {
  if (!ingrediente || !insumo) {
    console.warn('Ingrediente o insumo no encontrado');
    return 0;
  }

  // Obtener datos del ingrediente
  const cantidadNecesaria = parseFloat(ingrediente.cantidad) || 0;
  const unidadNecesaria = ingrediente.unidad || 'unidad';

  // Obtener datos del insumo
  const precioTotal = insumo.precioActual || insumo.precio_unitario || insumo.precio || 0;
  const cantidadComprada = insumo.cantidad || insumo.cantidadComprada || 1;
  const unidadComprada = insumo.unidad || insumo.unidadComprada || 'unidad';

  // Calcular precio por unidad base del insumo
  const precioPorUnidadBase = precioTotal / cantidadComprada;

  // Convertir la cantidad necesaria a la unidad base del insumo
  const cantidadEnUnidadBase = convertirACantidadBase(
    cantidadNecesaria, 
    unidadNecesaria, 
    unidadComprada
  );

  // Calcular costo total del ingrediente
  const costoIngrediente = cantidadEnUnidadBase * precioPorUnidadBase;

  console.log(`🔧 Cálculo costo ingrediente ${ingrediente.nombre || ingrediente.insumoNombre}:`, {
    cantidadNecesaria,
    unidadNecesaria,
    cantidadComprada,
    unidadComprada,
    precioTotal,
    precioPorUnidadBase,
    cantidadEnUnidadBase,
    costoIngrediente
  });

  return {
    costo: costoIngrediente,
    cantidadNecesaria,
    unidadNecesaria,
    cantidadComprada,
    unidadComprada,
    precioPorUnidadBase,
    cantidadEnUnidadBase
  };
}

// Función principal para calcular el costo total de una receta
export function calcularCostoRecetaMejorado(receta, insumos = []) {
  console.log('🔧 calcularCostoRecetaMejorado iniciado para:', receta.nombre);
  console.log('🔧 Insumos disponibles:', insumos.length);

  if (!receta.ingredientes || receta.ingredientes.length === 0) {
    console.log('❌ No hay ingredientes en la receta');
    return {
      costoTotal: 0,
      ingredientes: [],
      resumen: 'No hay ingredientes en la receta'
    };
  }

  const ingredientesConCosto = receta.ingredientes.map(ingrediente => {
    // Buscar el insumo correspondiente
    const insumo = insumos.find(i => 
      i.id === ingrediente.insumoId || 
      i.nombre === ingrediente.nombre ||
      i.nombre === ingrediente.insumoNombre
    );

    if (!insumo) {
      console.warn(`❌ Insumo no encontrado para ingrediente: ${ingrediente.nombre || ingrediente.insumoNombre}`);
      return {
        ...ingrediente,
        costo: 0,
        insumoEncontrado: false,
        error: 'Insumo no encontrado'
      };
    }

    const calculo = calcularCostoIngrediente(ingrediente, insumo);

    return {
      ...ingrediente,
      ...calculo,
      insumoEncontrado: true,
      insumoNombre: insumo.nombre
    };
  });

  const costoTotal = ingredientesConCosto.reduce((total, ingrediente) => {
    return total + (ingrediente.costo || 0);
  }, 0);

  console.log(`🔧 Costo total de receta ${receta.nombre}: $${costoTotal}`);

  return {
    costoTotal,
    ingredientes: ingredientesConCosto,
    resumen: `Costo total: $${costoTotal.toFixed(2)}`
  };
}

// Función para calcular el costo por unidad de producción
export function calcularCostoPorUnidad(receta, insumos = []) {
  const calculoReceta = calcularCostoRecetaMejorado(receta, insumos);
  const cantidadBase = parseFloat(receta.cantidadBase || receta.cantidad_base || 1);
  
  const costoPorUnidad = calculoReceta.costoTotal / cantidadBase;

  return {
    ...calculoReceta,
    costoPorUnidad,
    cantidadBase,
    resumen: `Costo por ${receta.unidadBase || receta.unidad_base || 'unidad'}: $${costoPorUnidad.toFixed(2)}`
  };
}

// Función para escalar una receta y calcular sus costos
export function escalarRecetaConCostos(receta, factorEscalado, insumos = []) {
  console.log(`🔧 Escalando receta ${receta.nombre} por factor ${factorEscalado}`);

  const cantidadEscalada = (receta.cantidadBase || receta.cantidad_base || 1) * factorEscalado;

  const ingredientesEscalados = receta.ingredientes.map(ingrediente => ({
    ...ingrediente,
    cantidad: ingrediente.cantidad * factorEscalado
  }));

  const recetaEscalada = {
    ...receta,
    id: `${receta.id}-escalada-${Date.now()}`,
    cantidadBase: cantidadEscalada,
    ingredientes: ingredientesEscalados,
    factorEscalado
  };

  const calculoEscalado = calcularCostoRecetaMejorado(recetaEscalada, insumos);

  return {
    recetaEscalada,
    calculo: calculoEscalado,
    factorEscalado,
    cantidadEscalada
  };
}

// Función para formatear moneda
export function formatCurrency(amount, showDecimals = false) {
  if (amount < 1000) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    }).format(amount);
  }
  
  // Para valores grandes, truncar a miles
  const truncatedAmount = Math.floor(amount / 1000) * 1000;
  const formatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(truncatedAmount);
  
  // Quitar los ceros innecesarios al final
  return formatted.replace(/\.000$/, '');
}

// Función para formatear moneda con decimales (para costos detallados)
export function formatCurrencyDetailed(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export default {
  convertirACantidadBase,
  calcularPrecioUnitario,
  calcularCostoIngrediente,
  calcularCostoRecetaMejorado,
  calcularCostoPorUnidad,
  escalarRecetaConCostos,
  formatCurrency,
  formatCurrencyDetailed
};
