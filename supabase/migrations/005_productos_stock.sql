-- Crear tabla productos_stock para control de inventario
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

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.productos_stock ENABLE ROW LEVEL SECURITY;

-- Crear políticas de RLS para productos_stock
-- Permitir a los usuarios autenticados ver todos los productos activos
CREATE POLICY "Allow authenticated users to view all active productos_stock"
ON public.productos_stock FOR SELECT
TO authenticated
USING (activo = true);

-- Permitir a los usuarios autenticados insertar productos
CREATE POLICY "Allow authenticated users to insert productos_stock"
ON public.productos_stock FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir a los usuarios autenticados actualizar productos
CREATE POLICY "Allow authenticated users to update productos_stock"
ON public.productos_stock FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Permitir a los usuarios autenticados eliminar (desactivar) productos
CREATE POLICY "Allow authenticated users to delete productos_stock"
ON public.productos_stock FOR UPDATE
TO authenticated
USING (true);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_productos_stock_categoria ON public.productos_stock (categoria);
CREATE INDEX IF NOT EXISTS idx_productos_stock_cantidad ON public.productos_stock (cantidad);
CREATE INDEX IF NOT EXISTS idx_productos_stock_activo ON public.productos_stock (activo);
CREATE INDEX IF NOT EXISTS idx_productos_stock_usuario_id ON public.productos_stock (usuario_id);

-- Trigger para actualizar 'updated_at' automáticamente
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.productos_stock
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');
