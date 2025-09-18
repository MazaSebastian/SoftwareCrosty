-- Script para verificar que la tabla notificaciones existe
-- Ejecutar en la consola SQL de Supabase

-- 1. Verificar que la tabla existe
SELECT 
    table_name,
    table_type,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'notificaciones';

-- 2. Verificar la estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'notificaciones'
ORDER BY ordinal_position;

-- 3. Verificar políticas RLS
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'notificaciones'
ORDER BY policyname;

-- 4. Intentar insertar una notificación de prueba
INSERT INTO notificaciones (tipo, titulo, mensaje, sector, prioridad)
VALUES ('sistema', 'Prueba', 'Notificación de prueba', 'sistema', 'baja')
RETURNING *;

-- 5. Verificar que se insertó correctamente
SELECT * FROM notificaciones WHERE titulo = 'Prueba';

-- 6. Limpiar la notificación de prueba
DELETE FROM notificaciones WHERE titulo = 'Prueba';
