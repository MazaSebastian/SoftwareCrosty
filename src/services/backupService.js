// Servicio de Backup Automático para CROSTY Software
// Importaciones temporales comentadas para evitar errores circulares
// import { 
//   obtenerMovimientosCaja, 
//   obtenerInsumos, 
//   obtenerRecetas, 
//   obtenerVentas,
//   obtenerProductosStock 
// } from './index';

class BackupService {
  constructor() {
    this.backupInterval = null;
    this.isBackupRunning = false;
    this.lastBackup = null;
    this.backupHistory = [];
  }

  // Configurar backup automático
  configurarBackupAutomatico(intervaloMinutos = 60) {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
    }

    this.backupInterval = setInterval(() => {
      this.ejecutarBackupAutomatico();
    }, intervaloMinutos * 60 * 1000);

    console.log(`🔄 Backup automático configurado cada ${intervaloMinutos} minutos`);
  }

  // Detener backup automático
  detenerBackupAutomatico() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
      console.log('⏹️ Backup automático detenido');
    }
  }

  // Ejecutar backup automático
  async ejecutarBackupAutomatico() {
    if (this.isBackupRunning) {
      console.log('⏳ Backup ya en progreso, saltando...');
      return;
    }

    try {
      this.isBackupRunning = true;
      console.log('🔄 Iniciando backup automático...');

      const backupData = await this.crearBackupCompleto();
      const backupInfo = await this.guardarBackup(backupData, 'automatico');

      this.lastBackup = backupInfo;
      this.backupHistory.unshift(backupInfo);

      // Mantener solo los últimos 10 backups en memoria
      if (this.backupHistory.length > 10) {
        this.backupHistory = this.backupHistory.slice(0, 10);
      }

      console.log('✅ Backup automático completado:', backupInfo.nombre);
      return backupInfo;

    } catch (error) {
      console.error('❌ Error en backup automático:', error);
      throw error;
    } finally {
      this.isBackupRunning = false;
    }
  }

  // Crear backup completo de todos los datos
  async crearBackupCompleto() {
    const timestamp = new Date().toISOString();
    
    try {
      // Recopilar todos los datos (datos mock por ahora)
      const datos = {
        metadata: {
          version: '1.0.0',
          timestamp: timestamp,
          tipo: 'backup_completo',
          empresa: 'CROSTY'
        },
        caja: {
          movimientos: [], // await obtenerMovimientosCaja(),
          estadisticas: await this.obtenerEstadisticasCaja()
        },
        insumos: {
          lista: [], // await obtenerInsumos(),
          historialPrecios: await this.obtenerHistorialPrecios()
        },
        recetas: {
          lista: [], // await obtenerRecetas(),
          estadisticas: await this.obtenerEstadisticasRecetas()
        },
        ventas: {
          lista: [], // await obtenerVentas(),
          estadisticas: await this.obtenerEstadisticasVentas()
        },
        stock: {
          productos: [], // await obtenerProductosStock(),
          movimientos: await this.obtenerMovimientosStock()
        },
        configuracion: {
          usuario: 'CROSTY',
          ultimaActualizacion: timestamp,
          configuracionBackup: {
            intervalo: 60,
            retencion: 30,
            compresion: true
          }
        }
      };

      return datos;
    } catch (error) {
      console.error('❌ Error creando backup completo:', error);
      throw error;
    }
  }

  // Guardar backup en localStorage
  async guardarBackup(datos, tipo = 'manual') {
    const timestamp = new Date();
    const nombre = `backup_${tipo}_${timestamp.toISOString().split('T')[0]}_${timestamp.getHours()}${timestamp.getMinutes()}`;
    
    try {
      // Comprimir datos (simulación)
      const datosComprimidos = JSON.stringify(datos);
      
      // Guardar en localStorage
      const backupInfo = {
        id: Date.now(),
        nombre: nombre,
        timestamp: timestamp.toISOString(),
        tipo: tipo,
        tamaño: datosComprimidos.length,
        datos: datosComprimidos,
        checksum: await this.calcularChecksum(datosComprimidos)
      };

      // Guardar backup
      localStorage.setItem(`backup_${backupInfo.id}`, JSON.stringify(backupInfo));
      
      // Actualizar lista de backups
      this.actualizarListaBackups(backupInfo);

      console.log('💾 Backup guardado:', nombre);
      return backupInfo;

    } catch (error) {
      console.error('❌ Error guardando backup:', error);
      throw error;
    }
  }

  // Restaurar backup
  async restaurarBackup(backupId) {
    try {
      const backupData = localStorage.getItem(`backup_${backupId}`);
      if (!backupData) {
        throw new Error('Backup no encontrado');
      }

      const backup = JSON.parse(backupData);
      const datos = JSON.parse(backup.datos);

      // Verificar checksum
      const checksumActual = await this.calcularChecksum(backup.datos);
      if (checksumActual !== backup.checksum) {
        throw new Error('Backup corrupto - checksum no coincide');
      }

      // Restaurar datos
      await this.restaurarDatos(datos);

      console.log('✅ Backup restaurado exitosamente:', backup.nombre);
      return backup;

    } catch (error) {
      console.error('❌ Error restaurando backup:', error);
      throw error;
    }
  }

  // Obtener lista de backups
  obtenerListaBackups() {
    try {
      const backups = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('backup_')) {
          const backup = JSON.parse(localStorage.getItem(key));
          backups.push(backup);
        }
      }
      
      // Ordenar por timestamp (más reciente primero)
      return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('❌ Error obteniendo lista de backups:', error);
      return [];
    }
  }

  // Eliminar backup
  eliminarBackup(backupId) {
    try {
      localStorage.removeItem(`backup_${backupId}`);
      console.log('🗑️ Backup eliminado:', backupId);
      return true;
    } catch (error) {
      console.error('❌ Error eliminando backup:', error);
      return false;
    }
  }

  // Limpiar backups antiguos
  limpiarBackupsAntiguos(diasRetencion = 30) {
    try {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - diasRetencion);
      
      const backups = this.obtenerListaBackups();
      let eliminados = 0;

      backups.forEach(backup => {
        if (new Date(backup.timestamp) < fechaLimite) {
          this.eliminarBackup(backup.id);
          eliminados++;
        }
      });

      console.log(`🧹 Limpieza completada: ${eliminados} backups eliminados`);
      return eliminados;
    } catch (error) {
      console.error('❌ Error limpiando backups:', error);
      return 0;
    }
  }

  // Exportar backup a archivo
  async exportarBackup(backupId) {
    try {
      const backup = JSON.parse(localStorage.getItem(`backup_${backupId}`));
      if (!backup) {
        throw new Error('Backup no encontrado');
      }

      const datos = JSON.parse(backup.datos);
      const archivo = {
        nombre: `${backup.nombre}.json`,
        contenido: JSON.stringify(datos, null, 2),
        tipo: 'application/json'
      };

      // Crear y descargar archivo
      const blob = new Blob([archivo.contenido], { type: archivo.tipo });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = archivo.nombre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('📤 Backup exportado:', archivo.nombre);
      return archivo;

    } catch (error) {
      console.error('❌ Error exportando backup:', error);
      throw error;
    }
  }

  // Importar backup desde archivo
  async importarBackup(archivo) {
    try {
      const contenido = await this.leerArchivo(archivo);
      const datos = JSON.parse(contenido);
      
      // Validar estructura
      if (!datos.metadata || !datos.metadata.timestamp) {
        throw new Error('Archivo de backup inválido');
      }

      // Crear backup
      const backupInfo = await this.guardarBackup(datos, 'importado');
      
      console.log('📥 Backup importado:', backupInfo.nombre);
      return backupInfo;

    } catch (error) {
      console.error('❌ Error importando backup:', error);
      throw error;
    }
  }

  // Métodos auxiliares
  async calcularChecksum(datos) {
    // Simulación de checksum (en producción usar crypto)
    return btoa(datos).slice(0, 16);
  }

  async obtenerEstadisticasCaja() {
    // Implementar según necesidades
    return { total: 0, movimientos: 0 };
  }

  async obtenerHistorialPrecios() {
    // Implementar según necesidades
    return [];
  }

  async obtenerEstadisticasRecetas() {
    // Implementar según necesidades
    return { total: 0, costoPromedio: 0 };
  }

  async obtenerEstadisticasVentas() {
    // Implementar según necesidades
    return { total: 0, ventas: 0 };
  }

  async obtenerMovimientosStock() {
    // Implementar según necesidades
    return [];
  }

  async restaurarDatos(datos) {
    // Implementar restauración de datos
    console.log('🔄 Restaurando datos...');
    // Aquí iría la lógica para restaurar cada módulo
  }

  actualizarListaBackups(backupInfo) {
    // Actualizar lista en localStorage
    const lista = JSON.parse(localStorage.getItem('backup_list') || '[]');
    lista.unshift(backupInfo);
    localStorage.setItem('backup_list', JSON.stringify(lista.slice(0, 50)));
  }

  async leerArchivo(archivo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(archivo);
    });
  }

  // Obtener estado del backup
  obtenerEstado() {
    return {
      isRunning: this.isBackupRunning,
      lastBackup: this.lastBackup,
      backupHistory: this.backupHistory,
      isAutomaticEnabled: !!this.backupInterval
    };
  }
}

// Instancia singleton
const backupService = new BackupService();

export default backupService;
