-- Script completo para crear tablas de planificaciones y configurar RLS
-- Ejecutar en la consola SQL de Supabase

-- 1. Crear tabla de planificaciones
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

-- 2. Crear tabla de tareas de planificaciones
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

-- 3. Crear tabla de templates de planificaciones
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

-- 4. Crear índices para mejorar el rendimiento
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

-- 5. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Crear triggers para actualizar updated_at
CREATE TRIGGER update_planificaciones_updated_at 
    BEFORE UPDATE ON planificaciones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planificaciones_tareas_updated_at 
    BEFORE UPDATE ON planificaciones_tareas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planificaciones_templates_updated_at 
    BEFORE UPDATE ON planificaciones_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Habilitar RLS en las tablas
ALTER TABLE public.planificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planificaciones_tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planificaciones_templates ENABLE ROW LEVEL SECURITY;

-- 8. Eliminar políticas existentes (si existen)
DROP POLICY IF EXISTS "Allow all operations for planificaciones" ON public.planificaciones;
DROP POLICY IF EXISTS "Allow all operations for planificaciones_tareas" ON public.planificaciones_tareas;
DROP POLICY IF EXISTS "Allow all operations for planificaciones_templates" ON public.planificaciones_templates;

-- 9. Crear políticas públicas para desarrollo (sin autenticación requerida)
CREATE POLICY "Allow public access to planificaciones"
ON public.planificaciones
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public access to planificaciones_tareas"
ON public.planificaciones_tareas
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public access to planificaciones_templates"
ON public.planificaciones_templates
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 10. Insertar algunos templates de ejemplo
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

-- 11. Verificar que las tablas y políticas se crearon correctamente
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('planificaciones', 'planificaciones_tareas', 'planificaciones_templates')
ORDER BY table_name;

-- 12. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('planificaciones', 'planificaciones_tareas', 'planificaciones_templates')
ORDER BY tablename, policyname;
