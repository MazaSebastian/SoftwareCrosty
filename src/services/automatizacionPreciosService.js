// Servicio de Automatización de Precios para CROSTY Software
import { obtenerInsumos, actualizarPrecioInsumo } from './insumosService';
import { obtenerRecetas, actualizarReceta } from './recetasService';
import { obtenerVentas } from './ventasService';

class AutomatizacionPreciosService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.configuracion = {
      margenMinimo: 30, // 30% margen mínimo
      margenObjetivo: 50, // 50% margen objetivo
      actualizacionAutomatica: true,
      notificarCambios: true,
      intervaloVerificacion: 6, // 6 horas por defecto
      historialCambios: []
    };
  }

  // Inicializar el sistema de automatización
  async inicializar() {
    try {
      console.log('🤖 Inicializando sistema de automatización de precios...');
      
      // Verificar cambios pendientes
      await this.verificarCambiosPendientes();
      
      // Configurar monitoreo automático
      if (this.configuracion.actualizacionAutomatica) {
        this.iniciarMonitoreo();
      }
      
      console.log('✅ Sistema de automatización de precios iniciado');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando automatización:', error);
      return false;
    }
  }

  // Iniciar monitoreo automático de precios
  iniciarMonitoreo() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Verificar cambios según configuración (por defecto cada 6 horas)
    const intervaloMs = this.configuracion.intervaloVerificacion * 60 * 60 * 1000;
    this.intervalId = setInterval(async () => {
      await this.verificarCambiosPendientes();
    }, intervaloMs);

    console.log(`🔄 Monitoreo automático de precios iniciado (cada ${this.configuracion.intervaloVerificacion} horas)`);
  }

  // Detener monitoreo automático
  detenerMonitoreo() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ Monitoreo automático detenido');
    }
  }

  // Verificar cambios pendientes en precios
  async verificarCambiosPendientes() {
    try {
      const insumos = await obtenerInsumos();
      const recetas = await obtenerRecetas();
      
      let cambiosDetectados = 0;
      const cambios = [];

      // Verificar cada insumo
      for (const insumo of insumos) {
        const cambiosInsumo = await this.verificarCambiosInsumo(insumo);
        if (cambiosInsumo.length > 0) {
          cambiosDetectados += cambiosInsumo.length;
          cambios.push(...cambiosInsumo);
        }
      }

      // Si hay cambios, procesarlos
      if (cambiosDetectados > 0) {
        await this.procesarCambios(cambios);
        console.log(`🔄 ${cambiosDetectados} cambios de precios procesados`);
      }

      return cambios;
    } catch (error) {
      console.error('❌ Error verificando cambios:', error);
      return [];
    }
  }

  // Verificar cambios específicos de un insumo
  async verificarCambiosInsumo(insumo) {
    const cambios = [];
    
    // Verificar si el precio actual es diferente al precio anterior
    if (insumo.precioAnterior && insumo.precioAnterior !== insumo.precioActual) {
      const cambioPorcentual = ((insumo.precioActual - insumo.precioAnterior) / insumo.precioAnterior) * 100;
      
      if (Math.abs(cambioPorcentual) >= 5) { // Cambio significativo del 5% o más
        cambios.push({
          tipo: 'precio_insumo',
          insumoId: insumo.id,
          insumoNombre: insumo.nombre,
          precioAnterior: insumo.precioAnterior,
          precioActual: insumo.precioActual,
          cambioPorcentual: cambioPorcentual,
          impacto: await this.calcularImpactoEnRecetas(insumo.id, cambioPorcentual)
        });
      }
    }

    return cambios;
  }

  // Calcular impacto de cambio de precio en recetas
  async calcularImpactoEnRecetas(insumoId, cambioPorcentual) {
    try {
      const recetas = await obtenerRecetas();
      const recetasAfectadas = recetas.filter(receta => 
        receta.ingredientes.some(ing => ing.insumoId === insumoId)
      );

      const impacto = {
        recetasAfectadas: recetasAfectadas.length,
        cambioCostoPromedio: 0,
        recetasDetalle: []
      };

      for (const receta of recetasAfectadas) {
        const ingrediente = receta.ingredientes.find(ing => ing.insumoId === insumoId);
        const costoAnterior = ingrediente.cantidad * ingrediente.precioUnitario;
        const costoNuevo = costoAnterior * (1 + cambioPorcentual / 100);
        const cambioCosto = costoNuevo - costoAnterior;

        impacto.recetasDetalle.push({
          recetaId: receta.id,
          recetaNombre: receta.nombre,
          cambioCosto: cambioCosto,
          nuevoCostoTotal: receta.costoTotal + cambioCosto
        });

        impacto.cambioCostoPromedio += cambioCosto;
      }

      if (impacto.recetasAfectadas > 0) {
        impacto.cambioCostoPromedio = impacto.cambioCostoPromedio / impacto.recetasAfectadas;
      }

      return impacto;
    } catch (error) {
      console.error('❌ Error calculando impacto:', error);
      return { recetasAfectadas: 0, cambioCostoPromedio: 0, recetasDetalle: [] };
    }
  }

  // Procesar cambios detectados
  async procesarCambios(cambios) {
    try {
      for (const cambio of cambios) {
        await this.procesarCambio(cambio);
      }

      // Guardar en historial
      this.configuracion.historialCambios.unshift({
        timestamp: new Date().toISOString(),
        cambios: cambios,
        procesados: cambios.length
      });

      // Mantener solo los últimos 50 cambios
      if (this.configuracion.historialCambios.length > 50) {
        this.configuracion.historialCambios = this.configuracion.historialCambios.slice(0, 50);
      }

      // Notificar si está habilitado
      if (this.configuracion.notificarCambios) {
        this.notificarCambios(cambios);
      }

    } catch (error) {
      console.error('❌ Error procesando cambios:', error);
    }
  }

  // Procesar un cambio individual
  async procesarCambio(cambio) {
    try {
      switch (cambio.tipo) {
        case 'precio_insumo':
          await this.actualizarRecetasPorCambioInsumo(cambio);
          break;
        default:
          console.log('Tipo de cambio no reconocido:', cambio.tipo);
      }
    } catch (error) {
      console.error('❌ Error procesando cambio individual:', error);
    }
  }

  // Actualizar recetas por cambio de precio de insumo
  async actualizarRecetasPorCambioInsumo(cambio) {
    try {
      const recetas = await obtenerRecetas();
      const recetasAfectadas = recetas.filter(receta => 
        receta.ingredientes.some(ing => ing.insumoId === cambio.insumoId)
      );

      for (const receta of recetasAfectadas) {
        const ingrediente = receta.ingredientes.find(ing => ing.insumoId === cambio.insumoId);
        
        // Actualizar precio del ingrediente
        ingrediente.precioUnitario = cambio.precioActual;
        
        // Recalcular costo total de la receta
        const nuevoCostoTotal = receta.ingredientes.reduce((total, ing) => {
          return total + (ing.cantidad * ing.precioUnitario);
        }, 0);

        // Actualizar receta
        const recetaActualizada = {
          ...receta,
          costoTotal: nuevoCostoTotal,
          costoPorPorcion: nuevoCostoTotal / receta.porciones,
          ultimaActualizacion: new Date().toISOString()
        };

        await actualizarReceta(receta.id, recetaActualizada);
        
        console.log(`📝 Receta "${receta.nombre}" actualizada por cambio de precio`);
      }
    } catch (error) {
      console.error('❌ Error actualizando recetas:', error);
    }
  }

  // Calcular precio de venta sugerido
  calcularPrecioVentaSugerido(costoTotal, margenObjetivo = null) {
    const margen = margenObjetivo || this.configuracion.margenObjetivo;
    const precioVenta = costoTotal * (1 + margen / 100);
    return Math.round(precioVenta * 100) / 100; // Redondear a 2 decimales
  }

  // Obtener sugerencias de precios para una receta
  async obtenerSugerenciasPrecio(recetaId) {
    try {
      const recetas = await obtenerRecetas();
      const receta = recetas.find(r => r.id === recetaId);
      
      if (!receta) {
        throw new Error('Receta no encontrada');
      }

      const ventas = await obtenerVentas({});
      const ventasReceta = ventas.filter(v => v.recetaNombre === receta.nombre);
      
      const sugerencias = {
        receta: receta,
        precios: {
          margenMinimo: this.calcularPrecioVentaSugerido(receta.costoTotal, this.configuracion.margenMinimo),
          margenObjetivo: this.calcularPrecioVentaSugerido(receta.costoTotal, this.configuracion.margenObjetivo),
          margenAlto: this.calcularPrecioVentaSugerido(receta.costoTotal, 70)
        },
        analisis: {
          ventasTotales: ventasReceta.length,
          precioPromedioVenta: ventasReceta.length > 0 ? 
            ventasReceta.reduce((sum, v) => sum + v.precioUnitario, 0) / ventasReceta.length : 0,
          margenActual: ventasReceta.length > 0 ? 
            ((ventasReceta[0].precioUnitario - receta.costoTotal) / receta.costoTotal) * 100 : 0
        }
      };

      return sugerencias;
    } catch (error) {
      console.error('❌ Error obteniendo sugerencias:', error);
      return null;
    }
  }

  // Notificar cambios importantes
  notificarCambios(cambios) {
    const cambiosImportantes = cambios.filter(c => 
      Math.abs(c.cambioPorcentual) >= 10 || c.impacto.recetasAfectadas >= 3
    );

    if (cambiosImportantes.length > 0) {
      console.log('🚨 CAMBIOS IMPORTANTES DETECTADOS:');
      cambiosImportantes.forEach(cambio => {
        console.log(`- ${cambio.insumoNombre}: ${cambio.cambioPorcentual.toFixed(1)}% (${cambio.impacto.recetasAfectadas} recetas afectadas)`);
      });
    }
  }

  // Obtener configuración actual
  obtenerConfiguracion() {
    return { ...this.configuracion };
  }

  // Actualizar configuración
  actualizarConfiguracion(nuevaConfiguracion) {
    this.configuracion = { ...this.configuracion, ...nuevaConfiguracion };
    
    // Reiniciar monitoreo si cambió la configuración
    if (nuevaConfiguracion.actualizacionAutomatica !== undefined) {
      if (nuevaConfiguracion.actualizacionAutomatica) {
        this.iniciarMonitoreo();
      } else {
        this.detenerMonitoreo();
      }
    }
  }

  // Obtener historial de cambios
  obtenerHistorialCambios() {
    return this.configuracion.historialCambios;
  }

  // Obtener estado del sistema
  obtenerEstado() {
    return {
      isRunning: this.isRunning,
      isMonitoring: !!this.intervalId,
      configuracion: this.configuracion,
      ultimaVerificacion: this.configuracion.historialCambios[0]?.timestamp || null
    };
  }
}

// Instancia singleton
const automatizacionPreciosService = new AutomatizacionPreciosService();

export default automatizacionPreciosService;
