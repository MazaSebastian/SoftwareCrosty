-- Script SQL para crear el esquema de base de datos en Supabase
-- CROSTY Software - Sistema de Gestión Gastronómica

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario', 'invitado')),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ultimo_acceso TIMESTAMP WITH TIME ZONE DEFAULT now(),
    configuracion JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de movimientos de caja
CREATE TABLE IF NOT EXISTS movimientos_caja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT now(),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
    concepto VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(20) NOT NULL CHECK (metodo IN ('efectivo', 'transferencia')),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    usuario_nombre VARCHAR(255),
    descripcion TEXT,
    categoria VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de insumos
CREATE TABLE IF NOT EXISTS insumos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    unidad VARCHAR(50) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    stock_actual DECIMAL(10,2) DEFAULT 0,
    stock_minimo DECIMAL(10,2) DEFAULT 0,
    proveedor VARCHAR(255),
    fecha_ultima_compra TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de recetas
CREATE TABLE IF NOT EXISTS recetas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    ingredientes JSONB NOT NULL,
    instrucciones TEXT,
    porciones INTEGER DEFAULT 1,
    costo_total DECIMAL(10,2) DEFAULT 0,
    precio_venta DECIMAL(10,2) DEFAULT 0,
    margen_ganancia DECIMAL(5,2) DEFAULT 0,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT now(),
    producto VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo', 'transferencia')),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    usuario_nombre VARCHAR(255),
    cliente VARCHAR(255),
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de stock de productos
CREATE TABLE IF NOT EXISTS stock_productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto VARCHAR(255) NOT NULL,
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    precio_venta DECIMAL(10,2) DEFAULT 0,
    categoria VARCHAR(100),
    fecha_ultima_produccion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de backups
CREATE TABLE IF NOT EXISTS backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('manual', 'automatico', 'importado')),
    datos JSONB NOT NULL,
    tamaño INTEGER NOT NULL,
    checksum VARCHAR(255) NOT NULL,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de configuración
CREATE TABLE IF NOT EXISTS configuracion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor JSONB NOT NULL,
    descripcion TEXT,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de automatización de precios
CREATE TABLE IF NOT EXISTS automatizacion_precios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    configuracion JSONB NOT NULL,
    estado VARCHAR(20) DEFAULT 'inactivo' CHECK (estado IN ('activo', 'inactivo', 'error')),
    ultima_ejecucion TIMESTAMP WITH TIME ZONE,
    proxima_ejecucion TIMESTAMP WITH TIME ZONE,
    historial JSONB DEFAULT '[]',
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_movimientos_caja_fecha ON movimientos_caja(fecha);
CREATE INDEX IF NOT EXISTS idx_movimientos_caja_usuario ON movimientos_caja(usuario_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_caja_tipo ON movimientos_caja(tipo);

CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ventas_producto ON ventas(producto);

CREATE INDEX IF NOT EXISTS idx_insumos_categoria ON insumos(categoria);
CREATE INDEX IF NOT EXISTS idx_insumos_activo ON insumos(activo);

CREATE INDEX IF NOT EXISTS idx_recetas_activa ON recetas(activa);
CREATE INDEX IF NOT EXISTS idx_recetas_nombre ON recetas(nombre);

CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_movimientos_caja_updated_at BEFORE UPDATE ON movimientos_caja FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insumos_updated_at BEFORE UPDATE ON insumos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recetas_updated_at BEFORE UPDATE ON recetas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_productos_updated_at BEFORE UPDATE ON stock_productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracion_updated_at BEFORE UPDATE ON configuracion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automatizacion_precios_updated_at BEFORE UPDATE ON automatizacion_precios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_caja ENABLE ROW LEVEL SECURITY;
ALTER TABLE insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;
ALTER TABLE automatizacion_precios ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios
CREATE POLICY "usuarios_select_policy" ON usuarios FOR SELECT USING (true);
CREATE POLICY "usuarios_insert_policy" ON usuarios FOR INSERT WITH CHECK (true);
CREATE POLICY "usuarios_update_policy" ON usuarios FOR UPDATE USING (true);
CREATE POLICY "usuarios_delete_policy" ON usuarios FOR DELETE USING (true);

-- Políticas de seguridad para movimientos de caja
CREATE POLICY "movimientos_caja_select_policy" ON movimientos_caja FOR SELECT USING (true);
CREATE POLICY "movimientos_caja_insert_policy" ON movimientos_caja FOR INSERT WITH CHECK (true);
CREATE POLICY "movimientos_caja_update_policy" ON movimientos_caja FOR UPDATE USING (true);
CREATE POLICY "movimientos_caja_delete_policy" ON movimientos_caja FOR DELETE USING (true);

-- Políticas de seguridad para insumos
CREATE POLICY "insumos_select_policy" ON insumos FOR SELECT USING (true);
CREATE POLICY "insumos_insert_policy" ON insumos FOR INSERT WITH CHECK (true);
CREATE POLICY "insumos_update_policy" ON insumos FOR UPDATE USING (true);
CREATE POLICY "insumos_delete_policy" ON insumos FOR DELETE USING (true);

-- Políticas de seguridad para recetas
CREATE POLICY "recetas_select_policy" ON recetas FOR SELECT USING (true);
CREATE POLICY "recetas_insert_policy" ON recetas FOR INSERT WITH CHECK (true);
CREATE POLICY "recetas_update_policy" ON recetas FOR UPDATE USING (true);
CREATE POLICY "recetas_delete_policy" ON recetas FOR DELETE USING (true);

-- Políticas de seguridad para ventas
CREATE POLICY "ventas_select_policy" ON ventas FOR SELECT USING (true);
CREATE POLICY "ventas_insert_policy" ON ventas FOR INSERT WITH CHECK (true);
CREATE POLICY "ventas_update_policy" ON ventas FOR UPDATE USING (true);
CREATE POLICY "ventas_delete_policy" ON ventas FOR DELETE USING (true);

-- Políticas de seguridad para stock de productos
CREATE POLICY "stock_productos_select_policy" ON stock_productos FOR SELECT USING (true);
CREATE POLICY "stock_productos_insert_policy" ON stock_productos FOR INSERT WITH CHECK (true);
CREATE POLICY "stock_productos_update_policy" ON stock_productos FOR UPDATE USING (true);
CREATE POLICY "stock_productos_delete_policy" ON stock_productos FOR DELETE USING (true);

-- Políticas de seguridad para backups
CREATE POLICY "backups_select_policy" ON backups FOR SELECT USING (true);
CREATE POLICY "backups_insert_policy" ON backups FOR INSERT WITH CHECK (true);
CREATE POLICY "backups_update_policy" ON backups FOR UPDATE USING (true);
CREATE POLICY "backups_delete_policy" ON backups FOR DELETE USING (true);

-- Políticas de seguridad para configuración
CREATE POLICY "configuracion_select_policy" ON configuracion FOR SELECT USING (true);
CREATE POLICY "configuracion_insert_policy" ON configuracion FOR INSERT WITH CHECK (true);
CREATE POLICY "configuracion_update_policy" ON configuracion FOR UPDATE USING (true);
CREATE POLICY "configuracion_delete_policy" ON configuracion FOR DELETE USING (true);

-- Políticas de seguridad para automatización de precios
CREATE POLICY "automatizacion_precios_select_policy" ON automatizacion_precios FOR SELECT USING (true);
CREATE POLICY "automatizacion_precios_insert_policy" ON automatizacion_precios FOR INSERT WITH CHECK (true);
CREATE POLICY "automatizacion_precios_update_policy" ON automatizacion_precios FOR UPDATE USING (true);
CREATE POLICY "automatizacion_precios_delete_policy" ON automatizacion_precios FOR DELETE USING (true);

-- Insertar usuarios por defecto
INSERT INTO usuarios (id, nombre, apellido, email, rol, activo) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Sebastián', 'Maza', 'sebastian@crosty.com', 'admin', true),
    ('550e8400-e29b-41d4-a716-446655440002', 'María', 'González', 'maria@crosty.com', 'usuario', true)
ON CONFLICT (email) DO NOTHING;

-- Insertar configuración por defecto
INSERT INTO configuracion (clave, valor, descripcion) VALUES
    ('empresa_nombre', '"CROSTY - Alimentos Congelados al Vacío"', 'Nombre de la empresa'),
    ('empresa_version', '"1.0.0"', 'Versión del software'),
    ('backup_intervalo', '120', 'Intervalo de backup automático en minutos'),
    ('backup_retencion', '30', 'Días de retención de backups'),
    ('automatizacion_intervalo', '6', 'Intervalo de verificación de precios en horas')
ON CONFLICT (clave) DO NOTHING;

-- Crear vista para estadísticas de caja
CREATE OR REPLACE VIEW estadisticas_caja AS
SELECT 
    DATE(fecha) as fecha,
    COUNT(*) as total_movimientos,
    SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) as total_ingresos,
    SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) as total_egresos,
    SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE -monto END) as saldo_dia,
    COUNT(DISTINCT usuario_id) as usuarios_activos
FROM movimientos_caja
GROUP BY DATE(fecha)
ORDER BY fecha DESC;

-- Crear vista para estadísticas por usuario
CREATE OR REPLACE VIEW estadisticas_usuarios AS
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.rol,
    COUNT(mc.id) as total_movimientos,
    SUM(CASE WHEN mc.tipo = 'ingreso' THEN mc.monto ELSE 0 END) as total_ingresos,
    SUM(CASE WHEN mc.tipo = 'egreso' THEN mc.monto ELSE 0 END) as total_egresos,
    SUM(CASE WHEN mc.tipo = 'ingreso' THEN mc.monto ELSE -mc.monto END) as saldo_total,
    MAX(mc.fecha) as ultimo_movimiento
FROM usuarios u
LEFT JOIN movimientos_caja mc ON u.id = mc.usuario_id
WHERE u.activo = true
GROUP BY u.id, u.nombre, u.apellido, u.rol
ORDER BY saldo_total DESC;

-- Comentarios en las tablas
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema CROSTY';
COMMENT ON TABLE movimientos_caja IS 'Tabla de movimientos de caja diaria';
COMMENT ON TABLE insumos IS 'Tabla de insumos e ingredientes';
COMMENT ON TABLE recetas IS 'Tabla de recetas y sus costos';
COMMENT ON TABLE ventas IS 'Tabla de ventas realizadas';
COMMENT ON TABLE stock_productos IS 'Tabla de control de stock de productos terminados';
COMMENT ON TABLE backups IS 'Tabla de respaldos del sistema';
COMMENT ON TABLE configuracion IS 'Tabla de configuración del sistema';
COMMENT ON TABLE automatizacion_precios IS 'Tabla de configuración de automatización de precios';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Esquema de base de datos CROSTY creado exitosamente';
    RAISE NOTICE '📊 Tablas creadas: usuarios, movimientos_caja, insumos, recetas, ventas, stock_productos, backups, configuracion, automatizacion_precios';
    RAISE NOTICE '🔒 Row Level Security habilitado en todas las tablas';
    RAISE NOTICE '👥 Usuarios por defecto creados: Sebastián Maza (admin), María González (usuario)';
    RAISE NOTICE '⚙️ Configuración por defecto insertada';
END $$;

