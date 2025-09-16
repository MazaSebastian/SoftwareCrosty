import { 
  obtenerVentas, 
  obtenerEstadisticasVentas,
  obtenerVentasHoy,
  obtenerVentasSemana,
  obtenerVentasMes
} from './ventasService';
import { obtenerMovimientosCaja, obtenerSaldosUsuarios } from './cajaService';
import { obtenerInsumos } from './insumosService';
import { obtenerRecetas } from './recetasService';

// Función para generar reporte de ventas por período
export async function generarReporteVentas(filtros) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const ventas = await obtenerVentas(filtros);
  const estadisticas = await obtenerEstadisticasVentas(filtros);
  
  return {
    resumen: estadisticas,
    ventas: ventas,
    analisis: {
      ventasPorDia: agruparVentasPorDia(ventas),
      ventasPorProducto: agruparVentasPorProducto(ventas),
      ventasPorMetodoPago: agruparVentasPorMetodoPago(ventas),
      tendenciaVentas: calcularTendenciaVentas(ventas)
    }
  };
}

// Función para generar reporte de caja por período
export async function generarReporteCaja(filtros) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const movimientos = await obtenerMovimientosCaja(filtros);
  const saldos = await obtenerSaldosUsuarios();
  
  const ingresos = movimientos.filter(m => m.tipo === 'ingreso');
  const gastos = movimientos.filter(m => m.tipo === 'gasto');
  
  return {
    resumen: {
      totalIngresos: ingresos.reduce((sum, m) => sum + m.monto, 0),
      totalGastos: gastos.reduce((sum, m) => sum + m.monto, 0),
      saldoNeto: ingresos.reduce((sum, m) => sum + m.monto, 0) - gastos.reduce((sum, m) => sum + m.monto, 0),
      cantidadMovimientos: movimientos.length
    },
    movimientos: movimientos,
    saldos: saldos,
    analisis: {
      gastosPorCategoria: agruparGastosPorCategoria(gastos),
      ingresosPorUsuario: agruparIngresosPorUsuario(ingresos),
      gastosPorUsuario: agruparGastosPorUsuario(gastos)
    }
  };
}

// Función para generar reporte de insumos
export async function generarReporteInsumos() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const insumos = await obtenerInsumos();
  
  return {
    resumen: {
      totalInsumos: insumos.length,
      insumosConStockBajo: insumos.filter(i => i.stockActual < i.stockMinimo).length,
      valorTotalStock: insumos.reduce((sum, i) => sum + (i.stockActual * i.precioActual), 0)
    },
    insumos: insumos,
    analisis: {
      insumosPorCategoria: agruparInsumosPorCategoria(insumos),
      insumosStockBajo: insumos.filter(i => i.stockActual < i.stockMinimo),
      insumosMasCaros: insumos.sort((a, b) => b.precioActual - a.precioActual).slice(0, 5)
    }
  };
}

// Función para generar reporte de recetas
export async function generarReporteRecetas() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const recetas = await obtenerRecetas();
  
  return {
    resumen: {
      totalRecetas: recetas.length,
      recetasActivas: recetas.filter(r => r.activa).length,
      costoPromedioReceta: recetas.reduce((sum, r) => sum + r.costoTotal, 0) / recetas.length
    },
    recetas: recetas,
    analisis: {
      recetasPorCategoria: agruparRecetasPorCategoria(recetas),
      recetasMasCaras: recetas.sort((a, b) => b.costoTotal - a.costoTotal).slice(0, 5),
      recetasMasBaratas: recetas.sort((a, b) => a.costoTotal - b.costoTotal).slice(0, 5)
    }
  };
}

// Función para generar reporte general del negocio
export async function generarReporteGeneral(filtros) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const [reporteVentas, reporteCaja, reporteInsumos, reporteRecetas] = await Promise.all([
    generarReporteVentas(filtros),
    generarReporteCaja(filtros),
    generarReporteInsumos(),
    generarReporteRecetas()
  ]);
  
  return {
    ventas: reporteVentas,
    caja: reporteCaja,
    insumos: reporteInsumos,
    recetas: reporteRecetas,
    resumenGeneral: {
      rentabilidad: reporteVentas.resumen.totalIngresos - reporteCaja.resumen.totalGastos,
      margenBruto: reporteVentas.resumen.totalIngresos > 0 ? 
        ((reporteVentas.resumen.totalIngresos - reporteCaja.resumen.totalGastos) / reporteVentas.resumen.totalIngresos) * 100 : 0,
      eficienciaOperativa: reporteVentas.resumen.totalVentas / reporteRecetas.resumen.totalRecetas
    }
  };
}

// Funciones auxiliares para agrupar datos
function agruparVentasPorDia(ventas) {
  const agrupado = {};
  ventas.forEach(venta => {
    const fecha = new Date(venta.fecha).toLocaleDateString('es-AR');
    if (!agrupado[fecha]) {
      agrupado[fecha] = { cantidad: 0, monto: 0 };
    }
    agrupado[fecha].cantidad += venta.cantidad;
    agrupado[fecha].monto += venta.subtotal;
  });
  return agrupado;
}

function agruparVentasPorProducto(ventas) {
  const agrupado = {};
  ventas.forEach(venta => {
    if (!agrupado[venta.recetaNombre]) {
      agrupado[venta.recetaNombre] = { cantidad: 0, monto: 0 };
    }
    agrupado[venta.recetaNombre].cantidad += venta.cantidad;
    agrupado[venta.recetaNombre].monto += venta.subtotal;
  });
  return agrupado;
}

function agruparVentasPorMetodoPago(ventas) {
  const agrupado = { efectivo: 0, transferencia: 0 };
  ventas.forEach(venta => {
    agrupado[venta.metodoPago] += venta.subtotal;
  });
  return agrupado;
}

function calcularTendenciaVentas(ventas) {
  if (ventas.length < 2) return 0;
  
  const ventasPorDia = agruparVentasPorDia(ventas);
  const fechas = Object.keys(ventasPorDia).sort();
  
  if (fechas.length < 2) return 0;
  
  const primerDia = ventasPorDia[fechas[0]].monto;
  const ultimoDia = ventasPorDia[fechas[fechas.length - 1]].monto;
  
  return primerDia > 0 ? ((ultimoDia - primerDia) / primerDia) * 100 : 0;
}

function agruparGastosPorCategoria(gastos) {
  const agrupado = {};
  gastos.forEach(gasto => {
    if (!agrupado[gasto.categoria]) {
      agrupado[gasto.categoria] = 0;
    }
    agrupado[gasto.categoria] += gasto.monto;
  });
  return agrupado;
}

function agruparIngresosPorUsuario(ingresos) {
  const agrupado = {};
  ingresos.forEach(ingreso => {
    if (!agrupado[ingreso.usuarioNombre]) {
      agrupado[ingreso.usuarioNombre] = 0;
    }
    agrupado[ingreso.usuarioNombre] += ingreso.monto;
  });
  return agrupado;
}

function agruparGastosPorUsuario(gastos) {
  const agrupado = {};
  gastos.forEach(gasto => {
    if (!agrupado[gasto.usuarioNombre]) {
      agrupado[gasto.usuarioNombre] = 0;
    }
    agrupado[gasto.usuarioNombre] += gasto.monto;
  });
  return agrupado;
}

function agruparInsumosPorCategoria(insumos) {
  const agrupado = {};
  insumos.forEach(insumo => {
    if (!agrupado[insumo.categoria]) {
      agrupado[insumo.categoria] = { cantidad: 0, valor: 0 };
    }
    agrupado[insumo.categoria].cantidad += 1;
    agrupado[insumo.categoria].valor += insumo.stockActual * insumo.precioActual;
  });
  return agrupado;
}

function agruparRecetasPorCategoria(recetas) {
  const agrupado = {};
  recetas.forEach(receta => {
    if (!agrupado[receta.categoria]) {
      agrupado[receta.categoria] = { cantidad: 0, costoPromedio: 0 };
    }
    agrupado[receta.categoria].cantidad += 1;
    agrupado[receta.categoria].costoPromedio += receta.costoTotal;
  });
  
  // Calcular promedio
  Object.keys(agrupado).forEach(categoria => {
    agrupado[categoria].costoPromedio = agrupado[categoria].costoPromedio / agrupado[categoria].cantidad;
  });
  
  return agrupado;
}

// Función para exportar reporte a JSON
export async function exportarReporte(reporte, nombreArchivo) {
  const dataStr = JSON.stringify(reporte, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}

// Función para obtener datos para gráficos
export async function obtenerDatosGraficos(tipo, filtros) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  switch (tipo) {
    case 'ventas_por_dia':
      const ventas = await obtenerVentas(filtros);
      return agruparVentasPorDia(ventas);
    
    case 'ventas_por_producto':
      const ventasProducto = await obtenerVentas(filtros);
      return agruparVentasPorProducto(ventasProducto);
    
    case 'gastos_por_categoria':
      const movimientos = await obtenerMovimientosCaja(filtros);
      const gastos = movimientos.filter(m => m.tipo === 'gasto');
      return agruparGastosPorCategoria(gastos);
    
    case 'insumos_por_categoria':
      const insumos = await obtenerInsumos();
      return agruparInsumosPorCategoria(insumos);
    
    default:
      return {};
  }
}



