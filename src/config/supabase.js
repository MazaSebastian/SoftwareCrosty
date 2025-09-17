// Configuración de Supabase para CROSTY Software
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Debug: Verificar que las variables de entorno se están cargando
console.log('🔧 Supabase Config Debug:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? '✅ Configurada' : '❌ No configurada');

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Configuración de tablas
export const TABLES = {
  USUARIOS: 'usuarios',
  MOVIMIENTOS_CAJA: 'movimientos_caja',
  INSUMOS: 'insumos',
  RECETAS: 'recetas',
  VENTAS: 'ventas',
  STOCK_PRODUCTOS: 'stock_productos',
  PRODUCTOS_STOCK: 'productos_stock',
  PLANIFICACIONES: 'planificaciones',
  PLANIFICACIONES_TAREAS: 'planificaciones_tareas',
  PLANIFICACIONES_TEMPLATES: 'planificaciones_templates',
  BACKUPS: 'backups',
  CONFIGURACION: 'configuracion',
  AUTOMATIZACION_PRECIOS: 'automatizacion_precios'
};

// Configuración de políticas RLS (Row Level Security)
export const RLS_POLICIES = {
  // Usuarios pueden ver todos los usuarios
  USUARIOS_SELECT: 'usuarios_select_policy',
  // Solo admins pueden insertar/actualizar/eliminar usuarios
  USUARIOS_MODIFY: 'usuarios_modify_policy',
  
  // Usuarios pueden ver todos los movimientos de caja
  CAJA_SELECT: 'caja_select_policy',
  // Usuarios pueden insertar sus propios movimientos
  CAJA_INSERT: 'caja_insert_policy',
  // Solo el usuario que creó el movimiento puede actualizarlo
  CAJA_UPDATE: 'caja_update_policy',
  // Solo admins pueden eliminar movimientos
  CAJA_DELETE: 'caja_delete_policy',
  
  // Políticas similares para otras tablas...
  INSUMOS_SELECT: 'insumos_select_policy',
  INSUMOS_MODIFY: 'insumos_modify_policy',
  
  RECETAS_SELECT: 'recetas_select_policy',
  RECETAS_MODIFY: 'recetas_modify_policy',
  
  VENTAS_SELECT: 'ventas_select_policy',
  VENTAS_INSERT: 'ventas_insert_policy',
  VENTAS_UPDATE: 'ventas_update_policy',
  VENTAS_DELETE: 'ventas_delete_policy',
  
  STOCK_SELECT: 'stock_select_policy',
  STOCK_MODIFY: 'stock_modify_policy',
  
  BACKUPS_SELECT: 'backups_select_policy',
  BACKUPS_MODIFY: 'backups_modify_policy',
  
  CONFIGURACION_SELECT: 'configuracion_select_policy',
  CONFIGURACION_MODIFY: 'configuracion_modify_policy',
  
  AUTOMATIZACION_SELECT: 'automatizacion_select_policy',
  AUTOMATIZACION_MODIFY: 'automatizacion_modify_policy'
};

// Configuración de esquemas de base de datos
export const SCHEMAS = {
  USUARIOS: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    nombre: 'varchar(100) NOT NULL',
    apellido: 'varchar(100) NOT NULL',
    email: 'varchar(255) UNIQUE NOT NULL',
    rol: 'varchar(20) DEFAULT "usuario" CHECK (rol IN ("admin", "usuario", "invitado"))',
    activo: 'boolean DEFAULT true',
    fecha_creacion: 'timestamp DEFAULT now()',
    ultimo_acceso: 'timestamp DEFAULT now()',
    configuracion: 'jsonb DEFAULT "{}"',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },
  
  MOVIMIENTOS_CAJA: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    fecha: 'timestamp DEFAULT now()',
    tipo: 'varchar(20) NOT NULL CHECK (tipo IN ("ingreso", "egreso"))',
    concepto: 'varchar(255) NOT NULL',
    monto: 'decimal(10,2) NOT NULL',
    metodo: 'varchar(20) NOT NULL CHECK (metodo IN ("efectivo", "transferencia"))',
    usuario_id: 'uuid REFERENCES usuarios(id) ON DELETE SET NULL',
    usuario_nombre: 'varchar(255)',
    descripcion: 'text',
    categoria: 'varchar(100)',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },
  
  INSUMOS: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    nombre: 'varchar(255) NOT NULL',
    categoria: 'varchar(100)',
    unidad: 'varchar(50) NOT NULL',
    precio_unitario: 'decimal(10,2) NOT NULL',
    stock_actual: 'decimal(10,2) DEFAULT 0',
    stock_minimo: 'decimal(10,2) DEFAULT 0',
    proveedor: 'varchar(255)',
    fecha_ultima_compra: 'timestamp',
    activo: 'boolean DEFAULT true',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },
  
  RECETAS: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    nombre: 'varchar(255) NOT NULL',
    descripcion: 'text',
    ingredientes: 'jsonb NOT NULL',
    instrucciones: 'text',
    porciones: 'integer DEFAULT 1',
    costo_total: 'decimal(10,2) DEFAULT 0',
    precio_venta: 'decimal(10,2) DEFAULT 0',
    margen_ganancia: 'decimal(5,2) DEFAULT 0',
    activa: 'boolean DEFAULT true',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },
  
  VENTAS: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    fecha: 'timestamp DEFAULT now()',
    producto: 'varchar(255) NOT NULL',
    cantidad: 'integer NOT NULL',
    precio_unitario: 'decimal(10,2) NOT NULL',
    subtotal: 'decimal(10,2) NOT NULL',
    metodo_pago: 'varchar(20) NOT NULL CHECK (metodo_pago IN ("efectivo", "transferencia"))',
    usuario_id: 'uuid REFERENCES usuarios(id) ON DELETE SET NULL',
    usuario_nombre: 'varchar(255)',
    cliente: 'varchar(255)',
    observaciones: 'text',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },
  
  STOCK_PRODUCTOS: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    producto: 'varchar(255) NOT NULL',
    stock_actual: 'integer DEFAULT 0',
    stock_minimo: 'integer DEFAULT 0',
    precio_venta: 'decimal(10,2) DEFAULT 0',
    categoria: 'varchar(100)',
    fecha_ultima_produccion: 'timestamp',
    activo: 'boolean DEFAULT true',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },
  
  BACKUPS: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    nombre: 'varchar(255) NOT NULL',
    tipo: 'varchar(20) NOT NULL CHECK (tipo IN ("manual", "automatico", "importado"))',
    datos: 'jsonb NOT NULL',
    tamaño: 'integer NOT NULL',
    checksum: 'varchar(255) NOT NULL',
    usuario_id: 'uuid REFERENCES usuarios(id) ON DELETE SET NULL',
    created_at: 'timestamp DEFAULT now()'
  },
  
  CONFIGURACION: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    clave: 'varchar(100) UNIQUE NOT NULL',
    valor: 'jsonb NOT NULL',
    descripcion: 'text',
    usuario_id: 'uuid REFERENCES usuarios(id) ON DELETE SET NULL',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },
  
  AUTOMATIZACION_PRECIOS: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    configuracion: 'jsonb NOT NULL',
    estado: 'varchar(20) DEFAULT "inactivo" CHECK (estado IN ("activo", "inactivo", "error"))',
    ultima_ejecucion: 'timestamp',
    proxima_ejecucion: 'timestamp',
    historial: 'jsonb DEFAULT "[]"',
    usuario_id: 'uuid REFERENCES usuarios(id) ON DELETE SET NULL',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  }
};

// Funciones de utilidad para Supabase
export const supabaseUtils = {
  // Obtener usuario actual desde Supabase Auth
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
  
  // Obtener perfil de usuario desde la tabla usuarios
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from(TABLES.USUARIOS)
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Actualizar último acceso del usuario
  async updateLastAccess(userId) {
    const { error } = await supabase
      .from(TABLES.USUARIOS)
      .update({ ultimo_acceso: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) throw error;
  },
  
  // Verificar si el usuario es admin
  async isAdmin(userId) {
    const { data, error } = await supabase
      .from(TABLES.USUARIOS)
      .select('rol')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data?.rol === 'admin';
  },
  
  // Obtener configuración del sistema
  async getConfig(key, userId = null) {
    let query = supabase
      .from(TABLES.CONFIGURACION)
      .select('valor')
      .eq('clave', key);
    
    if (userId) {
      query = query.eq('usuario_id', userId);
    }
    
    const { data, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') throw error; // Ignorar si no existe
    return data?.valor || null;
  },
  
  // Guardar configuración del sistema
  async setConfig(key, value, description = null, userId = null) {
    const configData = {
      clave: key,
      valor: value,
      descripcion: description,
      usuario_id: userId
    };
    
    const { error } = await supabase
      .from(TABLES.CONFIGURACION)
      .upsert(configData, { onConflict: 'clave' });
    
    if (error) throw error;
  }
};

// Configuración de sincronización en tiempo real
export const realtimeConfig = {
  // Configuración para movimientos de caja
  MOVIMIENTOS_CAJA: {
    table: TABLES.MOVIMIENTOS_CAJA,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    filter: null // Todos los usuarios pueden ver todos los movimientos
  },
  
  // Configuración para usuarios
  USUARIOS: {
    table: TABLES.USUARIOS,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    filter: null // Todos los usuarios pueden ver la lista de usuarios
  },
  
  // Configuración para insumos
  INSUMOS: {
    table: TABLES.INSUMOS,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    filter: null
  },
  
  // Configuración para recetas
  RECETAS: {
    table: TABLES.RECETAS,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    filter: null
  },
  
  // Configuración para ventas
  VENTAS: {
    table: TABLES.VENTAS,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    filter: null
  },
  
  // Configuración para stock
  STOCK: {
    table: TABLES.STOCK_PRODUCTOS,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    filter: null
  },
  
  // Configuración para planificaciones
  PLANIFICACIONES: {
    table: TABLES.PLANIFICACIONES,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    filter: null
  },
  
  // Configuración para tareas de planificaciones
  PLANIFICACIONES_TAREAS: {
    table: TABLES.PLANIFICACIONES_TAREAS,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    filter: null
  },
  
  // Configuración para templates de planificaciones
  PLANIFICACIONES_TEMPLATES: {
    table: TABLES.PLANIFICACIONES_TEMPLATES,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    filter: null
  }
};

export default supabase;

