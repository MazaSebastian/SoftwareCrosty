// Datos mock para desarrollo
let ventas = [
  {
    id: '1',
    fecha: new Date().toISOString(),
    tipo: 'tarta_salada',
    recetaId: 'receta1',
    recetaNombre: 'Tarta de Pollo',
    cantidad: 5,
    precioUnitario: 500,
    subtotal: 2500,
    metodoPago: 'efectivo',
    cliente: 'Cliente 1',
    notas: 'Para llevar',
    usuarioId: 'socio1',
    usuarioNombre: 'Socio 1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    fecha: new Date().toISOString(),
    tipo: 'pollo_condimentado',
    recetaId: 'receta2',
    recetaNombre: 'Pollo BBQ',
    cantidad: 3,
    precioUnitario: 800,
    subtotal: 2400,
    metodoPago: 'transferencia',
    cliente: 'Cliente 2',
    notas: 'Entrega a domicilio',
    usuarioId: 'socio2',
    usuarioNombre: 'Socio 2',
    createdAt: new Date().toISOString()
  }
];

export async function obtenerVentas(filtros) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let ventasFiltradas = [...ventas];

  if (filtros) {
    if (filtros.fechaInicio) {
      ventasFiltradas = ventasFiltradas.filter(v => 
        new Date(v.fecha) >= new Date(filtros.fechaInicio)
      );
    }
    
    if (filtros.fechaFin) {
      ventasFiltradas = ventasFiltradas.filter(v => 
        new Date(v.fecha) <= new Date(filtros.fechaFin)
      );
    }
    
    if (filtros.tipo) {
      ventasFiltradas = ventasFiltradas.filter(v => v.tipo === filtros.tipo);
    }
    
    if (filtros.metodoPago) {
      ventasFiltradas = ventasFiltradas.filter(v => v.metodoPago === filtros.metodoPago);
    }
    
    if (filtros.usuarioId) {
      ventasFiltradas = ventasFiltradas.filter(v => v.usuarioId === filtros.usuarioId);
    }
  }

  return ventasFiltradas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export async function crearVenta(venta) {
  const nuevaVenta = {
    ...venta,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  ventas.unshift(nuevaVenta);
  return nuevaVenta;
}

export async function eliminarVenta(id) {
  const index = ventas.findIndex(v => v.id === id);
  if (index !== -1) {
    ventas.splice(index, 1);
    return true;
  }
  return false;
}

export async function obtenerVentasPorPeriodo(fechaInicio, fechaFin) {
  return obtenerVentas({ fechaInicio, fechaFin });
}

export async function obtenerEstadisticasVentas(filtros) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const ventasFiltradas = await obtenerVentas(filtros);
  
  const estadisticas = {
    totalVentas: ventasFiltradas.length,
    totalIngresos: ventasFiltradas.reduce((sum, v) => sum + v.subtotal, 0),
    ventasEfectivo: ventasFiltradas.filter(v => v.metodoPago === 'efectivo').length,
    ventasTransferencia: ventasFiltradas.filter(v => v.metodoPago === 'transferencia').length,
    ingresosEfectivo: ventasFiltradas
      .filter(v => v.metodoPago === 'efectivo')
      .reduce((sum, v) => sum + v.subtotal, 0),
    ingresosTransferencia: ventasFiltradas
      .filter(v => v.metodoPago === 'transferencia')
      .reduce((sum, v) => sum + v.subtotal, 0),
    ventasPorTipo: {},
    ventasPorUsuario: {},
    promedioVenta: 0
  };
  
  // Calcular ventas por tipo
  ventasFiltradas.forEach(venta => {
    estadisticas.ventasPorTipo[venta.tipo] = (estadisticas.ventasPorTipo[venta.tipo] || 0) + 1;
  });
  
  // Calcular ventas por usuario
  ventasFiltradas.forEach(venta => {
    estadisticas.ventasPorUsuario[venta.usuarioId] = (estadisticas.ventasPorUsuario[venta.usuarioId] || 0) + 1;
  });
  
  // Calcular promedio
  if (estadisticas.totalVentas > 0) {
    estadisticas.promedioVenta = estadisticas.totalIngresos / estadisticas.totalVentas;
  }
  
  return estadisticas;
}

export async function obtenerVentasHoy() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);
  
  return obtenerVentas({
    fechaInicio: hoy.toISOString(),
    fechaFin: manana.toISOString()
  });
}

export async function obtenerVentasSemana() {
  const hoy = new Date();
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay());
  inicioSemana.setHours(0, 0, 0, 0);
  
  return obtenerVentas({
    fechaInicio: inicioSemana.toISOString(),
    fechaFin: hoy.toISOString()
  });
}

export async function obtenerVentasMes() {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  
  return obtenerVentas({
    fechaInicio: inicioMes.toISOString(),
    fechaFin: hoy.toISOString()
  });
}

export async function actualizarVenta(id, datosActualizados) {
  const index = ventas.findIndex(v => v.id === id);
  if (index !== -1) {
    ventas[index] = {
      ...ventas[index],
      ...datosActualizados,
      updatedAt: new Date().toISOString()
    };
    return ventas[index];
  }
  return null;
}

export async function obtenerVentaPorId(id) {
  return ventas.find(v => v.id === id);
}

export async function obtenerProductosDisponibles() {
  // Mock de productos disponibles para venta
  return [
    {
      id: 'tarta_pollo',
      nombre: 'Tarta de Pollo',
      tipo: 'tarta_salada',
      precio: 500,
      disponible: true,
      categoria: 'Tartas Saladas'
    },
    {
      id: 'tarta_verdura',
      nombre: 'Tarta de Verdura',
      tipo: 'tarta_salada',
      precio: 450,
      disponible: true,
      categoria: 'Tartas Saladas'
    },
    {
      id: 'pollo_bbq',
      nombre: 'Pollo BBQ',
      tipo: 'pollo_condimentado',
      precio: 800,
      disponible: true,
      categoria: 'Pollos Condimentados'
    },
    {
      id: 'pollo_herbes',
      nombre: 'Pollo con Hierbas',
      tipo: 'pollo_condimentado',
      precio: 750,
      disponible: true,
      categoria: 'Pollos Condimentados'
    }
  ];
}
