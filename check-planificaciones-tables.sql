-- Script para verificar si las tablas de planificaciones existen en Supabase
-- Ejecutar en la consola SQL de Supabase

-- 1. Verificar si las tablas existen
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('planificaciones', 'planificaciones_tareas', 'planificaciones_templates')
ORDER BY table_name;

-- 2. Verificar estructura de la tabla planificaciones
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'planificaciones' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar estructura de la tabla planificaciones_tareas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'planificaciones_tareas' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Verificar estructura de la tabla planificaciones_templates
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'planificaciones_templates' 
AND table_schema = 'public'
ORDER BY ordinal_position;
