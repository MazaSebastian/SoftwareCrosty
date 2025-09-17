-- Script para ejecutar directamente en la consola SQL de Supabase
-- Este script agrega la columna 'venta_id' a la tabla movimientos_caja

-- 1. Agregar columna 'venta_id' a la tabla movimientos_caja
ALTER TABLE public.movimientos_caja 
ADD COLUMN IF NOT EXISTS venta_id uuid;

-- 2. Crear índice para la columna venta_id
CREATE INDEX IF NOT EXISTS idx_movimientos_caja_venta_id ON public.movimientos_caja (venta_id);

-- 3. Comentario para documentar la columna
COMMENT ON COLUMN public.movimientos_caja.venta_id IS 'Referencia a la venta que generó este movimiento de caja';

-- 4. Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'movimientos_caja' 
AND table_schema = 'public'
ORDER BY ordinal_position;
