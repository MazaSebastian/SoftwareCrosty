-- Crear tabla de planificaciones
CREATE TABLE IF NOT EXISTS planificaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
        'produccion', 
        'pre_produccion', 
        'cortado_verduras', 
        'recibo_pedidos', 
        'limpieza', 
        'inventario', 
        'mantenimiento'
    )),
    prioridad VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completada', 'cancelada')),
    usuario_id VARCHAR(100),
    usuario_nombre VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de tareas de planificaciones
CREATE TABLE IF NOT EXISTS planificaciones_tareas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    planificacion_id UUID NOT NULL REFERENCES planificaciones(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
        'produccion', 
        'pre_produccion', 
        'cortado_verduras', 
        'recibo_pedidos', 
        'limpieza', 
        'inventario', 
        'mantenimiento'
    )),
    prioridad VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completada', 'cancelada')),
    hora_inicio TIME,
    hora_fin TIME,
    duracion_estimada INTEGER, -- en minutos
    usuario_asignado_id VARCHAR(100),
    usuario_asignado_nombre VARCHAR(255),
    observaciones TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de templates de planificaciones
CREATE TABLE IF NOT EXISTS planificaciones_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
        'produccion', 
        'pre_produccion', 
        'cortado_verduras', 
        'recibo_pedidos', 
        'limpieza', 
        'inventario', 
        'mantenimiento'
    )),
    tareas_template JSONB, -- Array de tareas template
    usuario_id VARCHAR(100),
    usuario_nombre VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_planificaciones_fecha ON planificaciones(fecha);
CREATE INDEX IF NOT EXISTS idx_planificaciones_tipo ON planificaciones(tipo);
CREATE INDEX IF NOT EXISTS idx_planificaciones_estado ON planificaciones(estado);
CREATE INDEX IF NOT EXISTS idx_planificaciones_usuario ON planificaciones(usuario_id);

CREATE INDEX IF NOT EXISTS idx_planificaciones_tareas_planificacion ON planificaciones_tareas(planificacion_id);
CREATE INDEX IF NOT EXISTS idx_planificaciones_tareas_tipo ON planificaciones_tareas(tipo);
CREATE INDEX IF NOT EXISTS idx_planificaciones_tareas_estado ON planificaciones_tareas(estado);
CREATE INDEX IF NOT EXISTS idx_planificaciones_tareas_usuario ON planificaciones_tareas(usuario_asignado_id);

CREATE INDEX IF NOT EXISTS idx_planificaciones_templates_tipo ON planificaciones_templates(tipo);
CREATE INDEX IF NOT EXISTS idx_planificaciones_templates_usuario ON planificaciones_templates(usuario_id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_planificaciones_updated_at 
    BEFORE UPDATE ON planificaciones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planificaciones_tareas_updated_at 
    BEFORE UPDATE ON planificaciones_tareas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planificaciones_templates_updated_at 
    BEFORE UPDATE ON planificaciones_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos templates de ejemplo
INSERT INTO planificaciones_templates (nombre, descripcion, tipo, tareas_template, usuario_nombre) VALUES
(
    'Producción de Tartas - Lunes',
    'Template para producción de tartas los lunes',
    'produccion',
    '[
        {
            "titulo": "Preparar masa",
            "descripcion": "Amasar y preparar la masa base para las tartas",
            "tipo": "pre_produccion",
            "prioridad": "alta",
            "hora_inicio": "08:00",
            "hora_fin": "09:00",
            "duracion_estimada": 60
        },
        {
            "titulo": "Cortar ingredientes",
            "descripcion": "Cortar y preparar todos los ingredientes",
            "tipo": "cortado_verduras",
            "prioridad": "alta",
            "hora_inicio": "09:00",
            "hora_fin": "10:30",
            "duracion_estimada": 90
        },
        {
            "titulo": "Armar tartas",
            "descripcion": "Armar y preparar las tartas para cocción",
            "tipo": "produccion",
            "prioridad": "alta",
            "hora_inicio": "10:30",
            "hora_fin": "12:00",
            "duracion_estimada": 90
        }
    ]'::jsonb,
    'Sistema'
),
(
    'Limpieza General - Viernes',
    'Template para limpieza general los viernes',
    'limpieza',
    '[
        {
            "titulo": "Limpieza de equipos",
            "descripcion": "Limpiar y desinfectar todos los equipos de cocina",
            "tipo": "limpieza",
            "prioridad": "media",
            "hora_inicio": "16:00",
            "hora_fin": "17:30",
            "duracion_estimada": 90
        },
        {
            "titulo": "Limpieza de superficies",
            "descripcion": "Limpiar mesadas, pisos y superficies",
            "tipo": "limpieza",
            "prioridad": "media",
            "hora_inicio": "17:30",
            "hora_fin": "18:30",
            "duracion_estimada": 60
        }
    ]'::jsonb,
    'Sistema'
);

-- Comentarios en las tablas
COMMENT ON TABLE planificaciones IS 'Tabla principal de planificaciones semanales';
COMMENT ON TABLE planificaciones_tareas IS 'Tareas específicas dentro de cada planificación';
COMMENT ON TABLE planificaciones_templates IS 'Templates reutilizables para crear planificaciones';

-- Comentarios en columnas importantes
COMMENT ON COLUMN planificaciones.tipo IS 'Tipo de planificación: produccion, pre_produccion, cortado_verduras, recibo_pedidos, limpieza, inventario, mantenimiento';
COMMENT ON COLUMN planificaciones.prioridad IS 'Prioridad: baja, media, alta, urgente';
COMMENT ON COLUMN planificaciones.estado IS 'Estado: pendiente, en_progreso, completada, cancelada';
COMMENT ON COLUMN planificaciones_tareas.duracion_estimada IS 'Duración estimada en minutos';
COMMENT ON COLUMN planificaciones_templates.tareas_template IS 'Array JSON con las tareas del template';
