// Importar servicio de usuarios
import { obtenerUsuarioActual, obtenerNombreCompleto } from './usuariosService';
import { supabase, TABLES } from '../config/supabase';

// Datos mock para desarrollo - Iniciando con datos limpios
let movimientosCaja = [];

export async function obtenerMovimientosCaja() {
  try {
    // Intentar obtener desde Supabase primero
    const { data, error } = await supabase
      .from(TABLES.MOVIMIENTOS_CAJA)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Si hay datos en Supabase, usarlos
    if (data && data.length > 0) {
      return data;
    }
    
    // Si no hay datos en Supabase, usar datos locales
    return [...movimientosCaja];
  } catch (error) {
    console.error('Error obteniendo movimientos desde Supabase, usando datos locales:', error);
    // En caso de error, usar datos locales
    return [...movimientosCaja];
  }
}

export async function crearMovimientoCaja(movimiento) {
  // Obtener usuario actual
  const usuarioActual = obtenerUsuarioActual();
  
  console.log('🔧 crearMovimientoCaja - usuarioActual:', usuarioActual);
  console.log('🔧 crearMovimientoCaja - ID del usuario:', usuarioActual?.id);
  console.log('🔧 crearMovimientoCaja - Tipo de ID:', typeof usuarioActual?.id);
  
  const nuevoMovimiento = {
    ...movimiento,
    usuario_id: usuarioActual?.id || null,
    usuario_nombre: usuarioActual ? obtenerNombreCompleto(usuarioActual) : 'Usuario no identificado',
    created_at: new Date().toISOString()
  };
  
  try {
    console.log('🔧 Usuario actual:', usuarioActual);
    console.log('🔧 Intentando guardar en Supabase:', nuevoMovimiento);
    
    // Intentar guardar en Supabase primero
    const { data, error } = await supabase
      .from(TABLES.MOVIMIENTOS_CAJA)
      .insert([nuevoMovimiento])
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }
    
    console.log('✅ Movimiento guardado en Supabase:', data);
    return data;
  } catch (error) {
    console.error('❌ Error guardando en Supabase, guardando localmente:', error);
    
    // En caso de error, guardar localmente
    const movimientoLocal = {
      ...nuevoMovimiento,
      id: Date.now().toString()
    };
    
    movimientosCaja.unshift(movimientoLocal);
    return movimientoLocal;
  }
}

export async function obtenerSaldosUsuarios() {
  const movimientos = await obtenerMovimientosCaja();
  const usuarios = new Map();

  console.log('🔧 obtenerSaldosUsuarios - Total movimientos:', movimientos.length);
  console.log('🔧 Primer movimiento de ejemplo:', movimientos[0]);

  movimientos.forEach(movimiento => {
    // Usar los campos correctos de Supabase (usuario_id, usuario_nombre)
    const usuarioId = movimiento.usuario_id || movimiento.usuarioId;
    const usuarioNombre = movimiento.usuario_nombre || movimiento.usuarioNombre;
    
    console.log('🔧 Procesando movimiento:', {
      usuarioId,
      usuarioNombre,
      tipo: movimiento.tipo,
      monto: movimiento.monto
    });
    
    if (!usuarios.has(usuarioId)) {
      usuarios.set(usuarioId, {
        usuarioId: usuarioId,
        usuarioNombre: usuarioNombre,
        saldoEfectivo: 0,
        saldoTransferencia: 0,
        saldoTotal: 0,
        ultimoMovimiento: movimiento.fecha
      });
    }

    const saldo = usuarios.get(usuarioId);
    
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
  try {
    console.log('🔧 Intentando eliminar movimiento con ID:', id);
    
    // Intentar eliminar desde Supabase primero
    const { data, error } = await supabase
      .from(TABLES.MOVIMIENTOS_CAJA)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }
    
    console.log('✅ Movimiento eliminado de Supabase:', data);
    return true;
  } catch (error) {
    console.error('❌ Error eliminando de Supabase, intentando localmente:', error);
    
    // En caso de error, intentar eliminar localmente
    const index = movimientosCaja.findIndex(m => m.id === id);
    if (index !== -1) {
      movimientosCaja.splice(index, 1);
      return true;
    }
    return false;
  }
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



