// Importar servicio de usuarios
import { obtenerUsuarioActual, obtenerNombreCompleto } from './usuariosService';

// Datos mock para desarrollo
let movimientosCaja = [
  {
    id: '1',
    fecha: new Date().toISOString(),
    tipo: 'ingreso',
    concepto: 'Venta Tartas',
    monto: 5000,
    metodo: 'efectivo',
    usuarioId: 1,
    usuarioNombre: 'Sebastián Maza',
    descripcion: 'Venta de 10 tartas',
    categoria: 'ventas',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    fecha: new Date().toISOString(),
    tipo: 'egreso',
    concepto: 'Compra Insumos',
    monto: 1500,
    metodo: 'transferencia',
    usuarioId: 2,
    usuarioNombre: 'María González',
    descripcion: 'Compra de ingredientes',
    categoria: 'insumos',
    createdAt: new Date().toISOString()
  }
];

export async function obtenerMovimientosCaja() {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...movimientosCaja];
}

export async function crearMovimientoCaja(movimiento) {
  // Obtener usuario actual
  const usuarioActual = obtenerUsuarioActual();
  
  const nuevoMovimiento = {
    ...movimiento,
    id: Date.now().toString(),
    usuarioId: usuarioActual?.id || null,
    usuarioNombre: usuarioActual ? obtenerNombreCompleto(usuarioActual) : 'Usuario no identificado',
    createdAt: new Date().toISOString()
  };
  
  movimientosCaja.unshift(nuevoMovimiento);
  return nuevoMovimiento;
}

export async function obtenerSaldosUsuarios() {
  const movimientos = await obtenerMovimientosCaja();
  const usuarios = new Map();

  movimientos.forEach(movimiento => {
    if (!usuarios.has(movimiento.usuarioId)) {
      usuarios.set(movimiento.usuarioId, {
        usuarioId: movimiento.usuarioId,
        usuarioNombre: movimiento.usuarioNombre,
        saldoEfectivo: 0,
        saldoTransferencia: 0,
        saldoTotal: 0,
        ultimoMovimiento: movimiento.fecha
      });
    }

    const saldo = usuarios.get(movimiento.usuarioId);
    
    if (movimiento.tipo === 'ingreso') {
      if (movimiento.metodo === 'efectivo') {
        saldo.saldoEfectivo += movimiento.monto;
      } else {
        saldo.saldoTransferencia += movimiento.monto;
      }
    } else {
      if (movimiento.metodo === 'efectivo') {
        saldo.saldoEfectivo -= movimiento.monto;
      } else {
        saldo.saldoTransferencia -= movimiento.monto;
      }
    }

    saldo.saldoTotal = saldo.saldoEfectivo + saldo.saldoTransferencia;
    
    if (new Date(movimiento.fecha) > new Date(saldo.ultimoMovimiento)) {
      saldo.ultimoMovimiento = movimiento.fecha;
    }
  });

  return Array.from(usuarios.values());
}

export async function eliminarMovimientoCaja(id) {
  const index = movimientosCaja.findIndex(m => m.id === id);
  if (index !== -1) {
    movimientosCaja.splice(index, 1);
    return true;
  }
  return false;
}

// Obtener saldo general de CROSTY (suma de todos los usuarios)
export async function obtenerSaldoGeneralCrosty() {
  const movimientos = await obtenerMovimientosCaja();
  
  let saldoEfectivo = 0;
  let saldoTransferencia = 0;
  let totalIngresos = 0;
  let totalEgresos = 0;
  
  movimientos.forEach(movimiento => {
    if (movimiento.tipo === 'ingreso') {
      totalIngresos += movimiento.monto;
      if (movimiento.metodo === 'efectivo') {
        saldoEfectivo += movimiento.monto;
      } else {
        saldoTransferencia += movimiento.monto;
      }
    } else {
      totalEgresos += movimiento.monto;
      if (movimiento.metodo === 'efectivo') {
        saldoEfectivo -= movimiento.monto;
      } else {
        saldoTransferencia -= movimiento.monto;
      }
    }
  });
  
  return {
    saldoEfectivo,
    saldoTransferencia,
    saldoTotal: saldoEfectivo + saldoTransferencia,
    totalIngresos,
    totalEgresos,
    utilidad: totalIngresos - totalEgresos,
    ultimaActualizacion: new Date().toISOString()
  };
}

// Obtener movimientos por usuario específico
export async function obtenerMovimientosPorUsuario(usuarioId) {
  const movimientos = await obtenerMovimientosCaja();
  return movimientos.filter(movimiento => movimiento.usuarioId === usuarioId);
}

// Obtener estadísticas por usuario
export async function obtenerEstadisticasPorUsuario(usuarioId) {
  const movimientos = await obtenerMovimientosPorUsuario(usuarioId);
  
  let saldoEfectivo = 0;
  let saldoTransferencia = 0;
  let totalIngresos = 0;
  let totalEgresos = 0;
  let cantidadMovimientos = movimientos.length;
  
  movimientos.forEach(movimiento => {
    if (movimiento.tipo === 'ingreso') {
      totalIngresos += movimiento.monto;
      if (movimiento.metodo === 'efectivo') {
        saldoEfectivo += movimiento.monto;
      } else {
        saldoTransferencia += movimiento.monto;
      }
    } else {
      totalEgresos += movimiento.monto;
      if (movimiento.metodo === 'efectivo') {
        saldoEfectivo -= movimiento.monto;
      } else {
        saldoTransferencia -= movimiento.monto;
      }
    }
  });
  
  return {
    usuarioId,
    saldoEfectivo,
    saldoTransferencia,
    saldoTotal: saldoEfectivo + saldoTransferencia,
    totalIngresos,
    totalEgresos,
    cantidadMovimientos,
    utilidad: totalIngresos - totalEgresos,
    ultimaActualizacion: new Date().toISOString()
  };
}

// Obtener resumen de caja con usuarios y saldo general
export async function obtenerResumenCajaCompleto() {
  const [saldosUsuarios, saldoGeneral] = await Promise.all([
    obtenerSaldosUsuarios(),
    obtenerSaldoGeneralCrosty()
  ]);
  
  return {
    saldoGeneral,
    saldosUsuarios,
    totalUsuarios: saldosUsuarios.length,
    ultimaActualizacion: new Date().toISOString()
  };
}



