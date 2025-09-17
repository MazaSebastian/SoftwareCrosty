import { supabase } from '../config/supabase';
import { TABLES } from '../config/supabase';
import { obtenerUsuarioActual } from './usuariosService';

export const ventasSupabaseAdapter = {
  // Obtener todas las ventas
  async obtenerVentas(filtros = {}) {
    let query = supabase
      .from(TABLES.VENTAS)
      .select('*')
      .order('fecha', { ascending: false });

    if (filtros.fechaInicio) {
      query = query.gte('fecha', filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query = query.lte('fecha', filtros.fechaFin);
    }
    if (filtros.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    if (filtros.metodoPago) {
      query = query.eq('metodo_pago', filtros.metodoPago);
    }
    if (filtros.usuarioId) {
      query = query.eq('usuario_id', filtros.usuarioId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
    return data.map(this.transformVentaFromSupabase);
  },

  // Crear una nueva venta
  async crearVenta(venta) {
    const usuarioActual = obtenerUsuarioActual();
    const ventaData = {
      ...this.transformVentaToSupabase(venta),
      usuario_id: usuarioActual?.id || null,
      usuario_nombre: usuarioActual?.nombre || 'Desconocido',
    };

    const { data, error } = await supabase
      .from(TABLES.VENTAS)
      .insert(ventaData)
      .select()
      .single();

    if (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
    return this.transformVentaFromSupabase(data);
  },

  // Actualizar una venta existente
  async actualizarVenta(id, datosActualizacion) {
    const updateData = this.transformVentaToSupabase(datosActualizacion);

    const { data, error } = await supabase
      .from(TABLES.VENTAS)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar venta:', error);
      throw error;
    }
    return this.transformVentaFromSupabase(data);
  },

  // Eliminar una venta (eliminar físicamente)
  async eliminarVenta(id) {
    const { error } = await supabase
      .from(TABLES.VENTAS)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar venta:', error);
      throw error;
    }
    return true;
  },

  // Obtener estadísticas de ventas
  async obtenerEstadisticasVentas(filtros = {}) {
    let query = supabase
      .from(TABLES.VENTAS)
      .select('*');

    if (filtros.fechaInicio) {
      query = query.gte('fecha', filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query = query.lte('fecha', filtros.fechaFin);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error al obtener estadísticas de ventas:', error);
      throw error;
    }

    const ventas = data.map(this.transformVentaFromSupabase);
    
    // Calcular estadísticas
    const totalVentas = ventas.length;
    const totalIngresos = ventas.reduce((sum, v) => sum + (v.subtotal || 0), 0);
    const ventasEfectivo = ventas.filter(v => v.metodoPago === 'efectivo').length;
    const ventasTransferencia = ventas.filter(v => v.metodoPago === 'transferencia').length;
    const ventasTarjeta = ventas.filter(v => v.metodoPago === 'tarjeta').length;

    // Ventas por día
    const ventasHoy = ventas.filter(v => {
      const hoy = new Date().toDateString();
      const fechaVenta = new Date(v.fecha).toDateString();
      return hoy === fechaVenta;
    });

    // Ventas por semana
    const inicioSemana = new Date();
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
    const ventasSemana = ventas.filter(v => new Date(v.fecha) >= inicioSemana);

    // Ventas por mes
    const inicioMes = new Date();
    inicioMes.setDate(1);
    const ventasMes = ventas.filter(v => new Date(v.fecha) >= inicioMes);

    return {
      totalVentas,
      totalIngresos,
      ventasEfectivo,
      ventasTransferencia,
      ventasTarjeta,
      ventasHoy: ventasHoy.length,
      ventasSemana: ventasSemana.length,
      ventasMes: ventasMes.length,
      ingresosHoy: ventasHoy.reduce((sum, v) => sum + (v.subtotal || 0), 0),
      ingresosSemana: ventasSemana.reduce((sum, v) => sum + (v.subtotal || 0), 0),
      ingresosMes: ventasMes.reduce((sum, v) => sum + (v.subtotal || 0), 0),
    };
  },

  // Obtener productos disponibles (recetas)
  async obtenerProductosDisponibles() {
    const { data, error } = await supabase
      .from(TABLES.RECETAS)
      .select('*')
      .eq('activa', true)
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error al obtener productos disponibles:', error);
      throw error;
    }

    return data.map(receta => ({
      id: receta.id,
      nombre: receta.nombre,
      tipo: 'receta',
      precio: receta.costoTotal || 0,
      descripcion: receta.descripcion,
      categoria: receta.categoria || 'general'
    }));
  },

  // Transformar datos de Supabase a formato local
  transformVentaFromSupabase(data) {
    return {
      id: data.id,
      fecha: data.fecha,
      tipo: data.tipo,
      recetaId: data.receta_id,
      recetaNombre: data.receta_nombre,
      cantidad: data.cantidad,
      precioUnitario: parseFloat(data.precio_unitario),
      subtotal: parseFloat(data.subtotal),
      metodoPago: data.metodo_pago,
      cliente: data.cliente,
      notas: data.notas,
      usuarioId: data.usuario_id,
      usuarioNombre: data.usuario_nombre,
      activa: data.activa,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  // Transformar datos locales a formato Supabase
  transformVentaToSupabase(data) {
    return {
      fecha: data.fecha || new Date().toISOString(),
      tipo: data.tipo || 'receta',
      receta_id: data.recetaId || null,
      receta_nombre: data.recetaNombre || 'Producto',
      cantidad: data.cantidad || 1,
      precio_unitario: data.precioUnitario || 0,
      subtotal: data.subtotal || 0,
      metodo_pago: data.metodoPago || 'efectivo',
      cliente: data.cliente || '',
      notas: data.notas || '',
    };
  },
};

export default ventasSupabaseAdapter;
