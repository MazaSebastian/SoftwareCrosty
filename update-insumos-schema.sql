-- Script para actualizar la tabla insumos en Supabase
-- Agregar columna cantidad y ajustar mapeo de campos

-- Agregar columna cantidad si no existe
ALTER TABLE insumos 
ADD COLUMN IF NOT EXISTS cantidad DECIMAL(10,2) DEFAULT 0;

-- Agregar columna usuario_id si no existe
ALTER TABLE insumos 
ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL;

-- Agregar columna usuario_nombre si no existe
ALTER TABLE insumos 
ADD COLUMN IF NOT EXISTS usuario_nombre VARCHAR(255);

-- Agregar columna descripcion si no existe
ALTER TABLE insumos 
ADD COLUMN IF NOT EXISTS descripcion TEXT;

-- Agregar columna fecha_ultimo_precio si no existe
ALTER TABLE insumos 
ADD COLUMN IF NOT EXISTS fecha_ultimo_precio TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Comentarios sobre el mapeo de campos:
-- precioActual (formulario) -> precio_unitario (tabla)
-- cantidad (formulario) -> cantidad (tabla) - NUEVA COLUMNA
-- stock_actual (tabla) -> se puede usar para stock actual
-- stock_minimo (tabla) -> se puede usar para stock mínimo
