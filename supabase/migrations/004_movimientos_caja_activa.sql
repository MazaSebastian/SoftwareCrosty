-- Agregar columna 'activa' a la tabla movimientos_caja
ALTER TABLE public.movimientos_caja 
ADD COLUMN IF NOT EXISTS activa boolean DEFAULT true;

-- Crear índice para la columna activa
CREATE INDEX IF NOT EXISTS idx_movimientos_caja_activa ON public.movimientos_caja (activa);

-- Actualizar registros existentes para que tengan activa = true
UPDATE public.movimientos_caja 
SET activa = true 
WHERE activa IS NULL;

-- Comentario para documentar la columna
COMMENT ON COLUMN public.movimientos_caja.activa IS 'Indica si el movimiento está activo (true) o desactivado (false)';
