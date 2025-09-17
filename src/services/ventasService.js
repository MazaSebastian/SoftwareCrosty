import { ventasSupabaseAdapter } from './ventasSupabaseAdapter';

// Usar Supabase para ventas
export async function obtenerVentas(filtros) {
  try {
    return await ventasSupabaseAdapter.obtenerVentas(filtros);
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    // Fallback a datos vacíos si hay error
    return [];
  }
}

export async function crearVenta(venta) {
  try {
    return await ventasSupabaseAdapter.crearVenta(venta);
  } catch (error) {
    console.error('Error creando venta:', error);
    throw error;
  }
}

export async function eliminarVenta(id) {
  try {
    return await ventasSupabaseAdapter.eliminarVenta(id);
  } catch (error) {
    console.error('Error eliminando venta:', error);
    throw error;
  }
}

export async function obtenerVentasPorPeriodo(fechaInicio, fechaFin) {
  return obtenerVentas({ fechaInicio, fechaFin });
}

export async function obtenerEstadisticasVentas(filtros) {
  try {
    return await ventasSupabaseAdapter.obtenerEstadisticasVentas(filtros);
  } catch (error) {
    console.error('Error obteniendo estadísticas de ventas:', error);
    // Fallback a estadísticas vacías si hay error
    return {
      totalVentas: 0,
      totalIngresos: 0,
      ventasEfectivo: 0,
      ventasTransferencia: 0,
      ventasTarjeta: 0,
      ventasHoy: 0,
      ventasSemana: 0,
      ventasMes: 0,
      ingresosHoy: 0,
      ingresosSemana: 0,
      ingresosMes: 0,
    };
  }
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
  try {
    return await ventasSupabaseAdapter.obtenerProductosDisponibles();
  } catch (error) {
    console.error('Error obteniendo productos disponibles:', error);
    // Fallback a productos mock si hay error
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
      }
    ];
  }
}
