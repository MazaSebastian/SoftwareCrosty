// Adaptadores para servicios existentes con Supabase
import { supabase, TABLES, supabaseUtils } from '../config/supabase';

// Adaptador para usuarios
export const usuariosSupabaseAdapter = {
  // Obtener todos los usuarios
  async obtenerUsuarios() {
    const { data, error } = await supabase
      .from(TABLES.USUARIOS)
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;
    return data.map(this.transformUsuarioFromSupabase);
  },

  // Obtener usuario por ID
  async obtenerUsuarioPorId(id) {
    const { data, error } = await supabase
      .from(TABLES.USUARIOS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.transformUsuarioFromSupabase(data);
  },

  // Crear usuario
  async crearUsuario(datosUsuario) {
    const usuarioData = this.transformUsuarioToSupabase(datosUsuario);
    
    const { data, error } = await supabase
      .from(TABLES.USUARIOS)
      .insert(usuarioData)
      .select()
      .single();

    if (error) throw error;
    return this.transformUsuarioFromSupabase(data);
  },

  // Actualizar usuario
  async actualizarUsuario(id, datosActualizacion) {
    const updateData = this.transformUsuarioToSupabase(datosActualizacion);
    
    const { data, error } = await supabase
      .from(TABLES.USUARIOS)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.transformUsuarioFromSupabase(data);
  },

  // Eliminar usuario (desactivar)
  async eliminarUsuario(id) {
    const { error } = await supabase
      .from(TABLES.USUARIOS)
      .update({ activo: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Transformar datos de Supabase a formato local
  transformUsuarioFromSupabase(data) {
    return {
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      rol: data.rol,
      activo: data.activo,
      fechaCreacion: data.fecha_creacion,
      ultimoAcceso: data.ultimo_acceso,
      configuracion: data.configuracion || {}
    };
  },

  // Transformar datos locales a formato Supabase
  transformUsuarioToSupabase(data) {
    return {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      rol: data.rol,
      activo: data.activo,
      configuracion: data.configuracion || {}
    };
  }
};

// Adaptador para movimientos de caja
export const cajaSupabaseAdapter = {
  // Obtener movimientos de caja
  async obtenerMovimientosCaja(filtros = {}) {
    let query = supabase
      .from(TABLES.MOVIMIENTOS_CAJA)
      .select('*')
      .order('fecha', { ascending: false });

    // Aplicar filtros
    if (filtros.usuarioId) {
      query = query.eq('usuario_id', filtros.usuarioId);
    }
    if (filtros.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    if (filtros.fechaDesde) {
      query = query.gte('fecha', filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      query = query.lte('fecha', filtros.fechaHasta);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data.map(this.transformMovimientoFromSupabase);
  },

  // Crear movimiento de caja
  async crearMovimientoCaja(movimiento) {
    const movimientoData = this.transformMovimientoToSupabase(movimiento);
    
    const { data, error } = await supabase
      .from(TABLES.MOVIMIENTOS_CAJA)
      .insert(movimientoData)
      .select()
      .single();

    if (error) throw error;
    return this.transformMovimientoFromSupabase(data);
  },

  // Eliminar movimiento de caja
  async eliminarMovimientoCaja(id) {
    const { error } = await supabase
      .from(TABLES.MOVIMIENTOS_CAJA)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Obtener saldo general de CROSTY
  async obtenerSaldoGeneralCrosty() {
    const { data, error } = await supabase
      .from(TABLES.MOVIMIENTOS_CAJA)
      .select('tipo, monto, metodo');

    if (error) throw error;

    let saldoEfectivo = 0;
    let saldoTransferencia = 0;
    let totalIngresos = 0;
    let totalEgresos = 0;

    data.forEach(movimiento => {
      if (movimiento.tipo === 'ingreso') {
        totalIngresos += parseFloat(movimiento.monto);
        if (movimiento.metodo === 'efectivo') {
          saldoEfectivo += parseFloat(movimiento.monto);
        } else {
          saldoTransferencia += parseFloat(movimiento.monto);
        }
      } else {
        totalEgresos += parseFloat(movimiento.monto);
        if (movimiento.metodo === 'efectivo') {
          saldoEfectivo -= parseFloat(movimiento.monto);
        } else {
          saldoTransferencia -= parseFloat(movimiento.monto);
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
  },

  // Obtener saldos por usuario
  async obtenerSaldosUsuarios() {
    const { data, error } = await supabase
      .from(TABLES.MOVIMIENTOS_CAJA)
      .select('usuario_id, usuario_nombre, tipo, monto, metodo');

    if (error) throw error;

    const usuarios = new Map();

    data.forEach(movimiento => {
      if (!usuarios.has(movimiento.usuario_id)) {
        usuarios.set(movimiento.usuario_id, {
          usuarioId: movimiento.usuario_id,
          usuarioNombre: movimiento.usuario_nombre,
          saldoEfectivo: 0,
          saldoTransferencia: 0,
          saldoTotal: 0,
          ultimoMovimiento: null
        });
      }

      const saldo = usuarios.get(movimiento.usuario_id);
      
      if (movimiento.tipo === 'ingreso') {
        if (movimiento.metodo === 'efectivo') {
          saldo.saldoEfectivo += parseFloat(movimiento.monto);
        } else {
          saldo.saldoTransferencia += parseFloat(movimiento.monto);
        }
      } else {
        if (movimiento.metodo === 'efectivo') {
          saldo.saldoEfectivo -= parseFloat(movimiento.monto);
        } else {
          saldo.saldoTransferencia -= parseFloat(movimiento.monto);
        }
      }

      saldo.saldoTotal = saldo.saldoEfectivo + saldo.saldoTransferencia;
    });

    return Array.from(usuarios.values());
  },

  // Transformar datos de Supabase a formato local
  transformMovimientoFromSupabase(data) {
    return {
      id: data.id,
      fecha: data.fecha,
      tipo: data.tipo,
      concepto: data.concepto,
      monto: parseFloat(data.monto),
      metodo: data.metodo,
      usuarioId: data.usuario_id,
      usuarioNombre: data.usuario_nombre,
      descripcion: data.descripcion,
      categoria: data.categoria,
      createdAt: data.created_at
    };
  },

  // Transformar datos locales a formato Supabase
  transformMovimientoToSupabase(data) {
    return {
      tipo: data.tipo,
      concepto: data.concepto,
      monto: data.monto,
      metodo: data.metodo,
      usuario_id: data.usuarioId,
      usuario_nombre: data.usuarioNombre,
      descripcion: data.descripcion,
      categoria: data.categoria
    };
  }
};

// Adaptador para insumos
export const insumosSupabaseAdapter = {
  // Obtener insumos
  async obtenerInsumos() {
    const { data, error } = await supabase
      .from(TABLES.INSUMOS)
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;
    return data.map(this.transformInsumoFromSupabase);
  },

  // Crear insumo
  async crearInsumo(insumo) {
    const insumoData = this.transformInsumoToSupabase(insumo);
    
    const { data, error } = await supabase
      .from(TABLES.INSUMOS)
      .insert(insumoData)
      .select()
      .single();

    if (error) throw error;
    return this.transformInsumoFromSupabase(data);
  },

  // Actualizar insumo
  async actualizarInsumo(id, datosActualizacion) {
    const updateData = this.transformInsumoToSupabase(datosActualizacion);
    
    const { data, error } = await supabase
      .from(TABLES.INSUMOS)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.transformInsumoFromSupabase(data);
  },

  // Eliminar insumo
  async eliminarInsumo(id) {
    const { error } = await supabase
      .from(TABLES.INSUMOS)
      .update({ activo: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Transformar datos de Supabase a formato local
  transformInsumoFromSupabase(data) {
    return {
      id: data.id,
      nombre: data.nombre,
      categoria: data.categoria,
      unidad: data.unidad,
      precioUnitario: parseFloat(data.precio_unitario),
      stockActual: parseFloat(data.stock_actual),
      stockMinimo: parseFloat(data.stock_minimo),
      proveedor: data.proveedor,
      fechaUltimaCompra: data.fecha_ultima_compra,
      activo: data.activo
    };
  },

  // Transformar datos locales a formato Supabase
  transformInsumoToSupabase(data) {
    return {
      nombre: data.nombre,
      categoria: data.categoria,
      unidad: data.unidad,
      precio_unitario: data.precioUnitario,
      stock_actual: data.stockActual,
      stock_minimo: data.stockMinimo,
      proveedor: data.proveedor,
      fecha_ultima_compra: data.fechaUltimaCompra,
      activo: data.activo
    };
  }
};

// Adaptador para recetas
export const recetasSupabaseAdapter = {
  // Obtener recetas
  async obtenerRecetas() {
    const { data, error } = await supabase
      .from(TABLES.RECETAS)
      .select('*')
      .eq('activa', true)
      .order('nombre');

    if (error) throw error;
    return data.map(this.transformRecetaFromSupabase);
  },

  // Crear receta
  async crearReceta(receta) {
    const recetaData = this.transformRecetaToSupabase(receta);
    
    const { data, error } = await supabase
      .from(TABLES.RECETAS)
      .insert(recetaData)
      .select()
      .single();

    if (error) throw error;
    return this.transformRecetaFromSupabase(data);
  },

  // Actualizar receta
  async actualizarReceta(id, datosActualizacion) {
    const updateData = this.transformRecetaToSupabase(datosActualizacion);
    
    const { data, error } = await supabase
      .from(TABLES.RECETAS)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.transformRecetaFromSupabase(data);
  },

  // Eliminar receta
  async eliminarReceta(id) {
    const { error } = await supabase
      .from(TABLES.RECETAS)
      .update({ activa: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Transformar datos de Supabase a formato local
  transformRecetaFromSupabase(data) {
    return {
      id: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      ingredientes: data.ingredientes,
      instrucciones: data.instrucciones,
      porciones: data.porciones,
      costoTotal: parseFloat(data.costo_total),
      precioVenta: parseFloat(data.precio_venta),
      margenGanancia: parseFloat(data.margen_ganancia),
      activa: data.activa
    };
  },

  // Transformar datos locales a formato Supabase
  transformRecetaToSupabase(data) {
    return {
      nombre: data.nombre,
      descripcion: data.descripcion,
      ingredientes: data.ingredientes,
      instrucciones: data.instrucciones,
      porciones: data.porciones,
      costo_total: data.costoTotal,
      precio_venta: data.precioVenta,
      margen_ganancia: data.margenGanancia,
      activa: data.activa
    };
  }
};

// Adaptador para ventas
export const ventasSupabaseAdapter = {
  // Obtener ventas
  async obtenerVentas(filtros = {}) {
    let query = supabase
      .from(TABLES.VENTAS)
      .select('*')
      .order('fecha', { ascending: false });

    // Aplicar filtros
    if (filtros.usuarioId) {
      query = query.eq('usuario_id', filtros.usuarioId);
    }
    if (filtros.fechaDesde) {
      query = query.gte('fecha', filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      query = query.lte('fecha', filtros.fechaHasta);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data.map(this.transformVentaFromSupabase);
  },

  // Crear venta
  async crearVenta(venta) {
    const ventaData = this.transformVentaToSupabase(venta);
    
    const { data, error } = await supabase
      .from(TABLES.VENTAS)
      .insert(ventaData)
      .select()
      .single();

    if (error) throw error;
    return this.transformVentaFromSupabase(data);
  },

  // Transformar datos de Supabase a formato local
  transformVentaFromSupabase(data) {
    return {
      id: data.id,
      fecha: data.fecha,
      producto: data.producto,
      cantidad: data.cantidad,
      precioUnitario: parseFloat(data.precio_unitario),
      subtotal: parseFloat(data.subtotal),
      metodoPago: data.metodo_pago,
      usuarioId: data.usuario_id,
      usuarioNombre: data.usuario_nombre,
      cliente: data.cliente,
      observaciones: data.observaciones
    };
  },

  // Transformar datos locales a formato Supabase
  transformVentaToSupabase(data) {
    return {
      producto: data.producto,
      cantidad: data.cantidad,
      precio_unitario: data.precioUnitario,
      subtotal: data.subtotal,
      metodo_pago: data.metodoPago,
      usuario_id: data.usuarioId,
      usuario_nombre: data.usuarioNombre,
      cliente: data.cliente,
      observaciones: data.observaciones
    };
  }
};

export default {
  usuarios: usuariosSupabaseAdapter,
  caja: cajaSupabaseAdapter,
  insumos: insumosSupabaseAdapter,
  recetas: recetasSupabaseAdapter,
  ventas: ventasSupabaseAdapter
};

