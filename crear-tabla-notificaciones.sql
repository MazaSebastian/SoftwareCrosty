-- Script para crear la tabla de notificaciones en Supabase
-- Ejecutar en la consola SQL de Supabase

-- 1. Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    prioridad VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridad IN ('critica', 'alta', 'media', 'baja')),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'leida', 'archivada')),
    sector VARCHAR(50) NOT NULL,
    datos_adicionales JSONB DEFAULT '{}',
    usuario_id VARCHAR(100),
    usuario_nombre VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_notificaciones_sector ON notificaciones(sector);
CREATE INDEX IF NOT EXISTS idx_notificaciones_estado ON notificaciones(estado);
CREATE INDEX IF NOT EXISTS idx_notificaciones_prioridad ON notificaciones(prioridad);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_created_at ON notificaciones(created_at);

-- 3. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_notificaciones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Crear trigger para actualizar updated_at
CREATE TRIGGER update_notificaciones_updated_at 
    BEFORE UPDATE ON notificaciones 
    FOR EACH ROW EXECUTE FUNCTION update_notificaciones_updated_at();

-- 5. Habilitar RLS en la tabla
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

-- 6. Eliminar políticas existentes (si existen)
DROP POLICY IF EXISTS "Allow public access to notificaciones" ON public.notificaciones;

-- 7. Crear política pública para desarrollo (sin autenticación requerida)
CREATE POLICY "Allow public access to notificaciones"
ON public.notificaciones
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 8. Verificar que la tabla se creó correctamente
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'notificaciones';

-- 9. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'notificaciones'
ORDER BY policyname;
