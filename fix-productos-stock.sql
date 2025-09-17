-- Script para ejecutar directamente en la consola SQL de Supabase
-- Este script crea la tabla productos_stock para control de inventario

-- 1. Crear tabla productos_stock
CREATE TABLE IF NOT EXISTS public.productos_stock (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar(255) NOT NULL,
    categoria varchar(100) NOT NULL,
    cantidad integer NOT NULL DEFAULT 0,
    stock_minimo integer NOT NULL DEFAULT 10,
    activo boolean DEFAULT true,
    usuario_id uuid,
    usuario_nombre varchar(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.productos_stock ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas de RLS
CREATE POLICY "Allow authenticated users to view all active productos_stock"
ON public.productos_stock FOR SELECT
TO authenticated
USING (activo = true);

CREATE POLICY "Allow authenticated users to insert productos_stock"
ON public.productos_stock FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update productos_stock"
ON public.productos_stock FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete productos_stock"
ON public.productos_stock FOR UPDATE
TO authenticated
USING (true);

-- 4. Crear índices
CREATE INDEX IF NOT EXISTS idx_productos_stock_categoria ON public.productos_stock (categoria);
CREATE INDEX IF NOT EXISTS idx_productos_stock_cantidad ON public.productos_stock (cantidad);
CREATE INDEX IF NOT EXISTS idx_productos_stock_activo ON public.productos_stock (activo);
CREATE INDEX IF NOT EXISTS idx_productos_stock_usuario_id ON public.productos_stock (usuario_id);

-- 5. Verificar que la tabla se creó correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'productos_stock' 
AND table_schema = 'public'
ORDER BY ordinal_position;
