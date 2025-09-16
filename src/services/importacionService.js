// Servicio de importación CSV para CROSTY Software
import { supabase, TABLES } from '../config/supabase';
import { obtenerUsuarioActual, obtenerNombreCompleto } from './usuariosService';

class ImportacionService {
  constructor() {
    this.estado = {
      importando: false,
      progreso: 0,
      total: 0,
      exitosos: 0,
      errores: 0,
      mensajes: []
    };
  }

  // Mapear columnas CSV a campos de Supabase
  mapearColumnasCSV = {
    // Mapeo flexible para diferentes formatos de CSV
    'fecha': ['fecha', 'date', 'fecha_movimiento', 'fecha_transaccion'],
    'tipo': ['tipo', 'type', 'movimiento', 'tipo_movimiento'],
    'concepto': ['concepto', 'concept', 'descripcion', 'description', 'motivo'],
    'monto': ['monto', 'amount', 'valor', 'cantidad', 'importe'],
    'metodo': ['metodo', 'method', 'forma_pago', 'payment_method'],
    'descripcion': ['descripcion', 'description', 'observaciones', 'notes'],
    'categoria': ['categoria', 'category', 'tipo_gasto', 'tipo_ingreso']
  };

  // Función para detectar automáticamente el mapeo de columnas
  detectarMapeoColumnas(headers) {
    const mapeo = {};
    
    headers.forEach((header, index) => {
      const headerLower = header.toLowerCase().trim();
      
      // Buscar coincidencias en el mapeo
      Object.keys(this.mapearColumnasCSV).forEach(campo => {
        if (this.mapearColumnasCSV[campo].includes(headerLower)) {
          mapeo[campo] = index;
        }
      });
    });
    
    return mapeo;
  }

  // Función para limpiar y validar datos
  limpiarDatos(row, mapeo) {
    const datos = {};
    
    // Fecha
    if (mapeo.fecha !== undefined) {
      const fechaStr = row[mapeo.fecha];
      if (fechaStr) {
        // Intentar parsear diferentes formatos de fecha
        const fecha = this.parsearFecha(fechaStr);
        if (fecha) {
          datos.fecha = fecha;
        }
      }
    }
    
    // Tipo (ingreso/egreso)
    if (mapeo.tipo !== undefined) {
      const tipo = row[mapeo.tipo]?.toLowerCase().trim();
      if (tipo === 'ingreso' || tipo === 'income' || tipo === 'entrada' || tipo === '1') {
        datos.tipo = 'ingreso';
      } else if (tipo === 'egreso' || tipo === 'expense' || tipo === 'salida' || tipo === '0') {
        datos.tipo = 'egreso';
      }
    }
    
    // Concepto
    if (mapeo.concepto !== undefined) {
      datos.concepto = row[mapeo.concepto]?.trim() || '';
    }
    
    // Monto
    if (mapeo.monto !== undefined) {
      const montoStr = row[mapeo.monto]?.toString().replace(/[^\d.,-]/g, '');
      const monto = parseFloat(montoStr?.replace(',', '.')) || 0;
      datos.monto = monto;
    }
    
    // Método de pago
    if (mapeo.metodo !== undefined) {
      const metodo = row[mapeo.metodo]?.toLowerCase().trim();
      if (metodo === 'efectivo' || metodo === 'cash' || metodo === 'contado') {
        datos.metodo = 'efectivo';
      } else if (metodo === 'transferencia' || metodo === 'transfer' || metodo === 'banco') {
        datos.metodo = 'transferencia';
      }
    }
    
    // Descripción
    if (mapeo.descripcion !== undefined) {
      datos.descripcion = row[mapeo.descripcion]?.trim() || null;
    }
    
    // Categoría
    if (mapeo.categoria !== undefined) {
      datos.categoria = row[mapeo.categoria]?.trim() || null;
    }
    
    return datos;
  }

  // Función para parsear diferentes formatos de fecha
  parsearFecha(fechaStr) {
    if (!fechaStr) return null;
    
    // Intentar diferentes formatos
    const formatos = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
      /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
      /^\d{4}\/\d{2}\/\d{2}$/ // YYYY/MM/DD
    ];
    
    try {
      const fecha = new Date(fechaStr);
      if (!isNaN(fecha.getTime())) {
        return fecha.toISOString();
      }
    } catch (error) {
      console.error('Error parseando fecha:', fechaStr, error);
    }
    
    return null;
  }

  // Función principal de importación
  async importarCSV(archivo, opciones = {}) {
    this.estado.importando = true;
    this.estado.progreso = 0;
    this.estado.exitosos = 0;
    this.estado.errores = 0;
    this.estado.mensajes = [];
    
    try {
      const texto = await this.leerArchivo(archivo);
      const filas = this.parsearCSV(texto);
      
      if (filas.length === 0) {
        throw new Error('El archivo CSV está vacío');
      }
      
      // Detectar mapeo de columnas
      const headers = filas[0];
      const mapeo = this.detectarMapeoColumnas(headers);
      
      console.log('🔧 Headers detectados:', headers);
      console.log('🔧 Mapeo de columnas:', mapeo);
      
      // Validar que tenemos los campos mínimos
      if (mapeo.concepto === undefined || mapeo.monto === undefined) {
        throw new Error('Faltan columnas obligatorias: concepto y monto');
      }
      
      // Procesar filas (saltar header)
      const datosFila = filas.slice(1);
      this.estado.total = datosFila.length;
      
      const movimientos = [];
      const errores = [];
      
      for (let i = 0; i < datosFila.length; i++) {
        try {
          const datos = this.limpiarDatos(datosFila[i], mapeo);
          
          // Validar datos mínimos
          if (!datos.concepto || !datos.monto) {
            errores.push(`Fila ${i + 2}: Faltan datos obligatorios (concepto o monto)`);
            continue;
          }
          
          // Agregar datos del usuario actual
          const usuarioActual = obtenerUsuarioActual();
          const movimiento = {
            ...datos,
            usuario_id: usuarioActual?.id || null,
            usuario_nombre: usuarioActual ? obtenerNombreCompleto(usuarioActual) : 'Importación CSV',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          movimientos.push(movimiento);
          this.estado.exitosos++;
          
        } catch (error) {
          errores.push(`Fila ${i + 2}: ${error.message}`);
          this.estado.errores++;
        }
        
        this.estado.progreso = Math.round(((i + 1) / datosFila.length) * 100);
      }
      
      // Insertar en Supabase
      if (movimientos.length > 0) {
        console.log('🔧 Insertando movimientos en Supabase:', movimientos.length);
        
        const { data, error } = await supabase
          .from(TABLES.MOVIMIENTOS_CAJA)
          .insert(movimientos)
          .select();
        
        if (error) {
          throw new Error(`Error insertando en Supabase: ${error.message}`);
        }
        
        console.log('✅ Movimientos insertados:', data.length);
      }
      
      // Preparar resultado
      const resultado = {
        exitoso: true,
        total: this.estado.total,
        exitosos: this.estado.exitosos,
        errores: this.estado.errores,
        mensajes: [
          `✅ Importación completada: ${this.estado.exitosos} movimientos importados`,
          ...errores.map(error => `❌ ${error}`)
        ]
      };
      
      return resultado;
      
    } catch (error) {
      console.error('❌ Error en importación:', error);
      return {
        exitoso: false,
        error: error.message,
        mensajes: [`❌ Error: ${error.message}`]
      };
    } finally {
      this.estado.importando = false;
    }
  }

  // Función para leer archivo CSV
  leerArchivo(archivo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Error leyendo archivo'));
      reader.readAsText(archivo, 'UTF-8');
    });
  }

  // Función para parsear CSV
  parsearCSV(texto) {
    const filas = [];
    const lineas = texto.split('\n');
    
    for (const linea of lineas) {
      if (linea.trim()) {
        // Parsear CSV simple (puede mejorarse para manejar comillas)
        const fila = linea.split(',').map(campo => campo.trim().replace(/^"|"$/g, ''));
        filas.push(fila);
      }
    }
    
    return filas;
  }

  // Obtener estado actual
  obtenerEstado() {
    return { ...this.estado };
  }
}

const importacionService = new ImportacionService();
export default importacionService;
