// Servicio de migración de datos para Supabase
import { supabase, TABLES, supabaseUtils } from '../config/supabase';

class MigrationService {
  constructor() {
    this.isMigrating = false;
    this.migrationProgress = 0;
    this.migrationStatus = 'idle'; // idle, migrating, completed, error
  }

  // Iniciar migración completa
  async startMigration() {
    if (this.isMigrating) {
      throw new Error('Migración ya en progreso');
    }

    try {
      this.isMigrating = true;
      this.migrationStatus = 'migrating';
      this.migrationProgress = 0;

      console.log('🚀 Iniciando migración a Supabase...');

      // 1. Migrar usuarios
      await this.migrateUsuarios();
      this.migrationProgress = 20;

      // 2. Migrar movimientos de caja
      await this.migrateMovimientosCaja();
      this.migrationProgress = 40;

      // 3. Migrar insumos
      await this.migrateInsumos();
      this.migrationProgress = 60;

      // 4. Migrar recetas
      await this.migrateRecetas();
      this.migrationProgress = 80;

      // 5. Migrar ventas
      await this.migrateVentas();
      this.migrationProgress = 100;

      this.migrationStatus = 'completed';
      console.log('✅ Migración completada exitosamente');

      return {
        success: true,
        message: 'Migración completada exitosamente',
        progress: 100
      };

    } catch (error) {
      this.migrationStatus = 'error';
      console.error('❌ Error en migración:', error);
      throw error;
    } finally {
      this.isMigrating = false;
    }
  }

  // Migrar usuarios desde localStorage a Supabase
  async migrateUsuarios() {
    console.log('👥 Migrando usuarios...');
    
    try {
      // Obtener usuarios desde el servicio local
      const { obtenerUsuarios } = await import('./usuariosService');
      const usuarios = await obtenerUsuarios();

      if (usuarios.length === 0) {
        console.log('No hay usuarios para migrar');
        return;
      }

      // Preparar datos para Supabase
      const usuariosData = usuarios.map(usuario => ({
        id: usuario.id.toString(),
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo,
        fecha_creacion: usuario.fechaCreacion,
        ultimo_acceso: usuario.ultimoAcceso,
        configuracion: usuario.configuracion || {}
      }));

      // Insertar en Supabase
      const { error } = await supabase
        .from(TABLES.USUARIOS)
        .upsert(usuariosData, { onConflict: 'id' });

      if (error) throw error;

      console.log(`✅ ${usuarios.length} usuarios migrados`);

    } catch (error) {
      console.error('❌ Error migrando usuarios:', error);
      throw error;
    }
  }

  // Migrar movimientos de caja
  async migrateMovimientosCaja() {
    console.log('💰 Migrando movimientos de caja...');
    
    try {
      const { obtenerMovimientosCaja } = await import('./cajaService');
      const movimientos = await obtenerMovimientosCaja();

      if (movimientos.length === 0) {
        console.log('No hay movimientos para migrar');
        return;
      }

      const movimientosData = movimientos.map(movimiento => ({
        id: movimiento.id,
        fecha: movimiento.fecha,
        tipo: movimiento.tipo,
        concepto: movimiento.concepto,
        monto: parseFloat(movimiento.monto),
        metodo: movimiento.metodo,
        usuario_id: movimiento.usuarioId?.toString() || null,
        usuario_nombre: movimiento.usuarioNombre,
        descripcion: movimiento.descripcion,
        categoria: movimiento.categoria
      }));

      const { error } = await supabase
        .from(TABLES.MOVIMIENTOS_CAJA)
        .upsert(movimientosData, { onConflict: 'id' });

      if (error) throw error;

      console.log(`✅ ${movimientos.length} movimientos migrados`);

    } catch (error) {
      console.error('❌ Error migrando movimientos:', error);
      throw error;
    }
  }

  // Migrar insumos
  async migrateInsumos() {
    console.log('🥬 Migrando insumos...');
    
    try {
      const { obtenerInsumos } = await import('./insumosService');
      const insumos = await obtenerInsumos();

      if (insumos.length === 0) {
        console.log('No hay insumos para migrar');
        return;
      }

      const insumosData = insumos.map(insumo => ({
        id: insumo.id.toString(),
        nombre: insumo.nombre,
        categoria: insumo.categoria,
        unidad: insumo.unidad,
        precio_unitario: parseFloat(insumo.precioUnitario),
        stock_actual: parseFloat(insumo.stockActual),
        stock_minimo: parseFloat(insumo.stockMinimo),
        proveedor: insumo.proveedor,
        fecha_ultima_compra: insumo.fechaUltimaCompra,
        activo: insumo.activo
      }));

      const { error } = await supabase
        .from(TABLES.INSUMOS)
        .upsert(insumosData, { onConflict: 'id' });

      if (error) throw error;

      console.log(`✅ ${insumos.length} insumos migrados`);

    } catch (error) {
      console.error('❌ Error migrando insumos:', error);
      throw error;
    }
  }

  // Migrar recetas
  async migrateRecetas() {
    console.log('🍽️ Migrando recetas...');
    
    try {
      const { obtenerRecetas } = await import('./recetasService');
      const recetas = await obtenerRecetas();

      if (recetas.length === 0) {
        console.log('No hay recetas para migrar');
        return;
      }

      const recetasData = recetas.map(receta => ({
        id: receta.id.toString(),
        nombre: receta.nombre,
        descripcion: receta.descripcion,
        ingredientes: receta.ingredientes,
        instrucciones: receta.instrucciones,
        porciones: receta.porciones,
        costo_total: parseFloat(receta.costoTotal),
        precio_venta: parseFloat(receta.precioVenta),
        margen_ganancia: parseFloat(receta.margenGanancia),
        activa: receta.activa
      }));

      const { error } = await supabase
        .from(TABLES.RECETAS)
        .upsert(recetasData, { onConflict: 'id' });

      if (error) throw error;

      console.log(`✅ ${recetas.length} recetas migradas`);

    } catch (error) {
      console.error('❌ Error migrando recetas:', error);
      throw error;
    }
  }

  // Migrar ventas
  async migrateVentas() {
    console.log('🛒 Migrando ventas...');
    
    try {
      const { obtenerVentas } = await import('./ventasService');
      const ventas = await obtenerVentas();

      if (ventas.length === 0) {
        console.log('No hay ventas para migrar');
        return;
      }

      const ventasData = ventas.map(venta => ({
        id: venta.id.toString(),
        fecha: venta.fecha,
        producto: venta.producto,
        cantidad: venta.cantidad,
        precio_unitario: parseFloat(venta.precioUnitario),
        subtotal: parseFloat(venta.subtotal),
        metodo_pago: venta.metodoPago,
        usuario_id: venta.usuarioId?.toString() || null,
        usuario_nombre: venta.usuarioNombre,
        cliente: venta.cliente,
        observaciones: venta.observaciones
      }));

      const { error } = await supabase
        .from(TABLES.VENTAS)
        .upsert(ventasData, { onConflict: 'id' });

      if (error) throw error;

      console.log(`✅ ${ventas.length} ventas migradas`);

    } catch (error) {
      console.error('❌ Error migrando ventas:', error);
      throw error;
    }
  }

  // Sincronizar datos desde Supabase a localStorage
  async syncFromSupabase() {
    console.log('🔄 Sincronizando datos desde Supabase...');
    
    try {
      // Sincronizar usuarios
      await this.syncUsuariosFromSupabase();
      
      // Sincronizar movimientos de caja
      await this.syncMovimientosFromSupabase();
      
      // Sincronizar insumos
      await this.syncInsumosFromSupabase();
      
      // Sincronizar recetas
      await this.syncRecetasFromSupabase();
      
      // Sincronizar ventas
      await this.syncVentasFromSupabase();

      console.log('✅ Sincronización completada');

    } catch (error) {
      console.error('❌ Error en sincronización:', error);
      throw error;
    }
  }

  // Sincronizar usuarios desde Supabase
  async syncUsuariosFromSupabase() {
    const { data, error } = await supabase
      .from(TABLES.USUARIOS)
      .select('*')
      .eq('activo', true);

    if (error) throw error;

    // Guardar en localStorage
    localStorage.setItem('crosty_usuarios_sync', JSON.stringify(data));
    console.log(`✅ ${data.length} usuarios sincronizados`);
  }

  // Sincronizar movimientos desde Supabase
  async syncMovimientosFromSupabase() {
    const { data, error } = await supabase
      .from(TABLES.MOVIMIENTOS_CAJA)
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw error;

    localStorage.setItem('crosty_movimientos_sync', JSON.stringify(data));
    console.log(`✅ ${data.length} movimientos sincronizados`);
  }

  // Sincronizar insumos desde Supabase
  async syncInsumosFromSupabase() {
    const { data, error } = await supabase
      .from(TABLES.INSUMOS)
      .select('*')
      .eq('activo', true);

    if (error) throw error;

    localStorage.setItem('crosty_insumos_sync', JSON.stringify(data));
    console.log(`✅ ${data.length} insumos sincronizados`);
  }

  // Sincronizar recetas desde Supabase
  async syncRecetasFromSupabase() {
    const { data, error } = await supabase
      .from(TABLES.RECETAS)
      .select('*')
      .eq('activa', true);

    if (error) throw error;

    localStorage.setItem('crosty_recetas_sync', JSON.stringify(data));
    console.log(`✅ ${data.length} recetas sincronizadas`);
  }

  // Sincronizar ventas desde Supabase
  async syncVentasFromSupabase() {
    const { data, error } = await supabase
      .from(TABLES.VENTAS)
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw error;

    localStorage.setItem('crosty_ventas_sync', JSON.stringify(data));
    console.log(`✅ ${data.length} ventas sincronizadas`);
  }

  // Verificar estado de la migración
  getMigrationStatus() {
    return {
      isMigrating: this.isMigrating,
      progress: this.migrationProgress,
      status: this.migrationStatus
    };
  }

  // Limpiar datos locales después de migración exitosa
  async cleanupLocalData() {
    console.log('🧹 Limpiando datos locales...');
    
    const keysToRemove = [
      'crosty_usuarios',
      'crosty_movimientos_caja',
      'crosty_insumos',
      'crosty_recetas',
      'crosty_ventas',
      'crosty_stock',
      'crosty_backups'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('✅ Datos locales limpiados');
  }

  // Verificar conexión con Supabase
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from(TABLES.USUARIOS)
        .select('count')
        .limit(1);

      if (error) throw error;

      return {
        success: true,
        message: 'Conexión con Supabase exitosa'
      };

    } catch (error) {
      return {
        success: false,
        message: `Error de conexión: ${error.message}`
      };
    }
  }
}

// Instancia singleton
const migrationService = new MigrationService();

export default migrationService;

