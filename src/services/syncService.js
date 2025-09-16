// Servicio de sincronización en tiempo real con Supabase
import { supabase, TABLES, realtimeConfig } from '../config/supabase';

class SyncService {
  constructor() {
    this.subscriptions = new Map();
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.isProcessingQueue = false;
    this.lastSyncTime = null;
  }

  // Inicializar servicio de sincronización
  async initialize() {
    console.log('🔄 Inicializando servicio de sincronización...');
    
    // Configurar listeners de conexión
    this.setupConnectionListeners();
    
    // Iniciar suscripciones en tiempo real
    await this.startRealtimeSubscriptions();
    
    // Procesar cola de sincronización si hay elementos pendientes
    if (this.syncQueue.length > 0) {
      await this.processSyncQueue();
    }

    console.log('✅ Servicio de sincronización inicializado');
  }

  // Configurar listeners de conexión
  setupConnectionListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Conexión restaurada');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Conexión perdida - Modo offline');
    });
  }

  // Iniciar suscripciones en tiempo real
  async startRealtimeSubscriptions() {
    try {
      // Suscripción a movimientos de caja
      await this.subscribeToTable('MOVIMIENTOS_CAJA', (payload) => {
        this.handleRealtimeUpdate('movimientos_caja', payload);
      });

      // Suscripción a usuarios
      await this.subscribeToTable('USUARIOS', (payload) => {
        this.handleRealtimeUpdate('usuarios', payload);
      });

      // Suscripción a insumos
      await this.subscribeToTable('INSUMOS', (payload) => {
        this.handleRealtimeUpdate('insumos', payload);
      });

      // Suscripción a recetas
      await this.subscribeToTable('RECETAS', (payload) => {
        this.handleRealtimeUpdate('recetas', payload);
      });

      // Suscripción a ventas
      await this.subscribeToTable('VENTAS', (payload) => {
        this.handleRealtimeUpdate('ventas', payload);
      });

      // Suscripción a stock
      await this.subscribeToTable('STOCK', (payload) => {
        this.handleRealtimeUpdate('stock', payload);
      });

    } catch (error) {
      console.error('❌ Error iniciando suscripciones:', error);
    }
  }

  // Suscribirse a una tabla específica
  async subscribeToTable(tableKey, callback) {
    const config = realtimeConfig[tableKey];
    if (!config) {
      console.warn(`⚠️ Configuración no encontrada para ${tableKey}`);
      return;
    }

    const subscription = supabase
      .channel(`${tableKey.toLowerCase()}_changes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: config.table
      }, callback)
      .subscribe();

    this.subscriptions.set(tableKey, subscription);
    console.log(`✅ Suscripción activa para ${tableKey}`);
  }

  // Manejar actualizaciones en tiempo real
  handleRealtimeUpdate(tableName, payload) {
    console.log(`🔄 Actualización en tiempo real: ${tableName}`, payload);

    const eventType = payload.eventType;
    const data = payload.new || payload.old;

    // Emitir evento personalizado para que los componentes puedan reaccionar
    const event = new CustomEvent('supabaseUpdate', {
      detail: {
        table: tableName,
        eventType: eventType,
        data: data,
        timestamp: new Date().toISOString()
      }
    });

    window.dispatchEvent(event);

    // Actualizar localStorage con los nuevos datos
    this.updateLocalStorage(tableName, eventType, data);
  }

  // Actualizar localStorage con datos de Supabase
  updateLocalStorage(tableName, eventType, data) {
    try {
      const storageKey = `crosty_${tableName}_sync`;
      let currentData = JSON.parse(localStorage.getItem(storageKey) || '[]');

      switch (eventType) {
        case 'INSERT':
          currentData.unshift(data);
          break;
        case 'UPDATE':
          const updateIndex = currentData.findIndex(item => item.id === data.id);
          if (updateIndex !== -1) {
            currentData[updateIndex] = data;
          }
          break;
        case 'DELETE':
          currentData = currentData.filter(item => item.id !== data.id);
          break;
      }

      localStorage.setItem(storageKey, JSON.stringify(currentData));
      console.log(`✅ localStorage actualizado para ${tableName}`);

    } catch (error) {
      console.error(`❌ Error actualizando localStorage para ${tableName}:`, error);
    }
  }

  // Sincronizar datos específicos
  async syncTable(tableName, force = false) {
    if (!this.isOnline) {
      console.log('📴 Sin conexión - Agregando a cola de sincronización');
      this.addToSyncQueue('syncTable', { tableName, force });
      return;
    }

    try {
      console.log(`🔄 Sincronizando ${tableName}...`);

      const { data, error } = await supabase
        .from(TABLES[tableName.toUpperCase()])
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Guardar en localStorage
      const storageKey = `crosty_${tableName}_sync`;
      localStorage.setItem(storageKey, JSON.stringify(data));

      this.lastSyncTime = new Date().toISOString();
      console.log(`✅ ${tableName} sincronizado: ${data.length} registros`);

      return data;

    } catch (error) {
      console.error(`❌ Error sincronizando ${tableName}:`, error);
      throw error;
    }
  }

  // Sincronización completa
  async fullSync() {
    if (!this.isOnline) {
      console.log('📴 Sin conexión - Sincronización diferida');
      return;
    }

    try {
      console.log('🔄 Iniciando sincronización completa...');

      const tables = ['USUARIOS', 'MOVIMIENTOS_CAJA', 'INSUMOS', 'RECETAS', 'VENTAS', 'STOCK_PRODUCTOS'];
      
      for (const table of tables) {
        await this.syncTable(table.toLowerCase());
      }

      this.lastSyncTime = new Date().toISOString();
      console.log('✅ Sincronización completa finalizada');

    } catch (error) {
      console.error('❌ Error en sincronización completa:', error);
      throw error;
    }
  }

  // Agregar operación a la cola de sincronización
  addToSyncQueue(operation, params) {
    this.syncQueue.push({
      operation,
      params,
      timestamp: new Date().toISOString()
    });

    console.log(`📋 Operación agregada a cola: ${operation}`);
  }

  // Procesar cola de sincronización
  async processSyncQueue() {
    if (this.isProcessingQueue || !this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    console.log(`🔄 Procesando cola de sincronización: ${this.syncQueue.length} operaciones`);

    try {
      while (this.syncQueue.length > 0) {
        const { operation, params } = this.syncQueue.shift();
        
        switch (operation) {
          case 'syncTable':
            await this.syncTable(params.tableName, params.force);
            break;
          case 'fullSync':
            await this.fullSync();
            break;
          default:
            console.warn(`⚠️ Operación no reconocida: ${operation}`);
        }
      }

      console.log('✅ Cola de sincronización procesada');

    } catch (error) {
      console.error('❌ Error procesando cola de sincronización:', error);
    } finally {
      this.isProcessingQueue = false;
    }
  }

  // Enviar datos locales a Supabase
  async pushLocalData(tableName, data) {
    if (!this.isOnline) {
      console.log('📴 Sin conexión - Agregando a cola de sincronización');
      this.addToSyncQueue('pushData', { tableName, data });
      return;
    }

    try {
      console.log(`📤 Enviando datos locales a ${tableName}...`);

      const { error } = await supabase
        .from(TABLES[tableName.toUpperCase()])
        .upsert(data, { onConflict: 'id' });

      if (error) throw error;

      console.log(`✅ Datos enviados a ${tableName}`);

    } catch (error) {
      console.error(`❌ Error enviando datos a ${tableName}:`, error);
      throw error;
    }
  }

  // Obtener estado de sincronización
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      lastSyncTime: this.lastSyncTime,
      queueLength: this.syncQueue.length,
      isProcessingQueue: this.isProcessingQueue,
      activeSubscriptions: this.subscriptions.size
    };
  }

  // Detener todas las suscripciones
  async stopAllSubscriptions() {
    console.log('🛑 Deteniendo suscripciones...');
    
    for (const [key, subscription] of this.subscriptions) {
      await supabase.removeChannel(subscription);
      console.log(`✅ Suscripción ${key} detenida`);
    }

    this.subscriptions.clear();
  }

  // Limpiar servicio
  async cleanup() {
    await this.stopAllSubscriptions();
    this.syncQueue = [];
    this.isProcessingQueue = false;
    console.log('🧹 Servicio de sincronización limpiado');
  }
}

// Instancia singleton
const syncService = new SyncService();

export default syncService;

