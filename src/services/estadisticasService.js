import { obtenerMovimientosCaja } from './cajaService';
import { obtenerVentas } from './ventasService';
import { obtenerInsumos } from './insumosService';
import { obtenerRecetas } from './recetasService';
import { obtenerProducciones } from './produccionService';

export async function calcularEstadisticas() {
  try {
    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);
    
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes
    inicioSemana.setHours(0, 0, 0, 0);
    
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6); // Domingo
    finSemana.setHours(23, 59, 59, 999);
    
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59);

    // Obtener datos
    const [movimientosCaja, ventas, insumos, recetas, producciones] = await Promise.all([
      obtenerMovimientosCaja(),
      obtenerVentas(),
      obtenerInsumos(),
      obtenerRecetas(),
      obtenerProducciones()
    ]);

    // Filtrar datos por fechas
    const movimientosHoy = movimientosCaja.filter(m => {
      const fecha = new Date(m.fecha);
      return fecha >= inicioHoy && fecha <= finHoy;
    });
    
    const movimientosMes = movimientosCaja.filter(m => {
      const fecha = new Date(m.fecha);
      return fecha >= inicioMes && fecha <= finMes;
    });

    const ventasHoy = ventas.filter(v => {
      const fecha = new Date(v.fecha);
      return fecha >= inicioHoy && fecha <= finHoy;
    });

    const ventasSemana = ventas.filter(v => {
      const fecha = new Date(v.fecha);
      return fecha >= inicioSemana && fecha <= finSemana;
    });

    const ventasMes = ventas.filter(v => {
      const fecha = new Date(v.fecha);
      return fecha >= inicioMes && fecha <= finMes;
    });

    const produccionHoy = producciones.filter(p => {
      const fecha = new Date(p.fecha);
      return fecha >= inicioHoy && fecha <= finHoy;
    });

    // Calcular estadísticas de ventas hoy
    const ventasHoyStats = {
      cantidad: ventasHoy.length,
      monto: ventasHoy.reduce((sum, v) => sum + v.subtotal, 0),
      efectivo: ventasHoy
        .filter(v => v.metodoPago === 'efectivo')
        .reduce((sum, v) => sum + v.subtotal, 0),
      transferencia: ventasHoy
        .filter(v => v.metodoPago === 'transferencia')
        .reduce((sum, v) => sum + v.subtotal, 0)
    };

    // Calcular estadísticas de ventas semana
    const ventasSemanaStats = {
      cantidad: ventasSemana.length,
      monto: ventasSemana.reduce((sum, v) => sum + v.subtotal, 0),
      promedioDiario: ventasSemana.length > 0 ? 
        ventasSemana.reduce((sum, v) => sum + v.subtotal, 0) / 7 : 0
    };

    // Calcular estadísticas de ventas mes
    const ventasMesStats = {
      cantidad: ventasMes.length,
      monto: ventasMes.reduce((sum, v) => sum + v.subtotal, 0),
      promedioDiario: ventasMes.length > 0 ? 
        ventasMes.reduce((sum, v) => sum + v.subtotal, 0) / new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate() : 0
    };

    // Calcular gastos
    const gastosHoy = movimientosHoy.filter(m => m.tipo === 'egreso');
    const gastosMes = movimientosMes.filter(m => m.tipo === 'egreso');

    const gastosHoyStats = {
      cantidad: gastosHoy.length,
      monto: gastosHoy.reduce((sum, g) => sum + g.monto, 0)
    };

    const gastosMesStats = {
      cantidad: gastosMes.length,
      monto: gastosMes.reduce((sum, g) => sum + g.monto, 0)
    };

    // Calcular saldo de caja
    const ingresosEfectivo = movimientosCaja
      .filter(m => m.tipo === 'ingreso' && m.metodo === 'efectivo')
      .reduce((sum, m) => sum + m.monto, 0);
    
    const egresosEfectivo = movimientosCaja
      .filter(m => m.tipo === 'egreso' && m.metodo === 'efectivo')
      .reduce((sum, m) => sum + m.monto, 0);

    const ingresosTransferencia = movimientosCaja
      .filter(m => m.tipo === 'ingreso' && m.metodo === 'transferencia')
      .reduce((sum, m) => sum + m.monto, 0);
    
    const egresosTransferencia = movimientosCaja
      .filter(m => m.tipo === 'egreso' && m.metodo === 'transferencia')
      .reduce((sum, m) => sum + m.monto, 0);

    const saldoCaja = {
      efectivo: ingresosEfectivo - egresosEfectivo,
      transferencia: ingresosTransferencia - egresosTransferencia,
      total: (ingresosEfectivo - egresosEfectivo) + (ingresosTransferencia - egresosTransferencia)
    };

    // Calcular stock bajo
    const stockBajo = insumos.filter(i => i.stockActual <= i.stockMinimo).length;

    // Calcular recetas activas
    const recetasActivas = recetas.filter(r => r.activa).length;

    // Calcular producción hoy
    const produccionHoyStats = {
      cantidad: produccionHoy.length,
      costoTotal: produccionHoy.reduce((sum, p) => sum + p.costoTotal, 0)
    };

    return {
      ventasHoy: ventasHoyStats,
      ventasSemana: ventasSemanaStats,
      ventasMes: ventasMesStats,
      gastosHoy: gastosHoyStats,
      gastosMes: gastosMesStats,
      saldoCaja,
      stockBajo,
      recetasActivas,
      produccionHoy: produccionHoyStats
    };

  } catch (error) {
    console.error('Error al calcular estadísticas:', error);
    // Retornar estadísticas vacías en caso de error
    return {
      ventasHoy: { cantidad: 0, monto: 0, efectivo: 0, transferencia: 0 },
      ventasSemana: { cantidad: 0, monto: 0, promedioDiario: 0 },
      ventasMes: { cantidad: 0, monto: 0, promedioDiario: 0 },
      gastosHoy: { cantidad: 0, monto: 0 },
      gastosMes: { cantidad: 0, monto: 0 },
      saldoCaja: { efectivo: 0, transferencia: 0, total: 0 },
      stockBajo: 0,
      recetasActivas: 0,
      produccionHoy: { cantidad: 0, costoTotal: 0 }
    };
  }
}



