-- Script para actualizar la tabla recetas en Supabase
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar las columnas faltantes a la tabla recetas
ALTER TABLE recetas 
ADD COLUMN IF NOT EXISTS categoria VARCHAR(100),
ADD COLUMN IF NOT EXISTS tipo VARCHAR(50) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS cantidad_base DECIMAL(10,2) DEFAULT 1,
ADD COLUMN IF NOT EXISTS rendimiento DECIMAL(10,2) DEFAULT 1,
ADD COLUMN IF NOT EXISTS unidad_base VARCHAR(50) DEFAULT 'unidad',
ADD COLUMN IF NOT EXISTS tiempo_preparacion INTEGER,
ADD COLUMN IF NOT EXISTS dificultad VARCHAR(20) DEFAULT 'media',
ADD COLUMN IF NOT EXISTS costo_total_ingredientes DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS usuario_nombre VARCHAR(255);

-- Actualizar valores por defecto para columnas existentes
ALTER TABLE recetas 
ALTER COLUMN margen_ganancia SET DEFAULT 0.3;

-- Verificar que la tabla se actualizó correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'recetas' 
ORDER BY ordinal_position;
