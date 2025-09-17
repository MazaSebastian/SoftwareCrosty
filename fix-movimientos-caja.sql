-- Script para ejecutar directamente en la consola SQL de Supabase
-- Este script agrega la columna 'activa' a la tabla movimientos_caja

-- 1. Agregar columna 'activa' a la tabla movimientos_caja
ALTER TABLE public.movimientos_caja 
ADD COLUMN IF NOT EXISTS activa boolean DEFAULT true;

-- 2. Crear índice para la columna activa
CREATE INDEX IF NOT EXISTS idx_movimientos_caja_activa ON public.movimientos_caja (activa);

-- 3. Actualizar registros existentes para que tengan activa = true
UPDATE public.movimientos_caja 
SET activa = true 
WHERE activa IS NULL;

-- 4. Comentario para documentar la columna
COMMENT ON COLUMN public.movimientos_caja.activa IS 'Indica si el movimiento está activo (true) o desactivado (false)';

-- 5. Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'movimientos_caja' 
AND table_schema = 'public'
ORDER BY ordinal_position;
