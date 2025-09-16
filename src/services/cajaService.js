// Datos mock para desarrollo
let movimientosCaja = [
  {
    id: '1',
    fecha: new Date().toISOString(),
    tipo: 'ingreso',
    concepto: 'Venta Tartas',
    monto: 5000,
    metodo: 'efectivo',
    usuarioId: 'socio1',
    usuarioNombre: 'Socio 1',
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
    usuarioId: 'socio2',
    usuarioNombre: 'Socio 2',
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
  const nuevoMovimiento = {
    ...movimiento,
    id: Date.now().toString(),
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



