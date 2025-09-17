-- Crear la tabla de ventas
CREATE TABLE IF NOT EXISTS public.ventas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha timestamp with time zone NOT NULL DEFAULT now(),
    tipo varchar(50) NOT NULL,
    receta_id uuid REFERENCES public.recetas(id) ON DELETE SET NULL,
    receta_nombre varchar(255) NOT NULL,
    cantidad integer NOT NULL DEFAULT 1,
    precio_unitario decimal(10,2) NOT NULL DEFAULT 0,
    subtotal decimal(10,2) NOT NULL DEFAULT 0,
    metodo_pago varchar(20) NOT NULL CHECK (metodo_pago IN ('efectivo', 'transferencia', 'tarjeta')),
    cliente varchar(255),
    notas text,
    usuario_id uuid REFERENCES public.usuarios(id) ON DELETE SET NULL,
    usuario_nombre varchar(255),
    activa boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;

-- Crear políticas de RLS para ventas
-- Permitir a los usuarios autenticados ver todas las ventas activas
CREATE POLICY "Allow authenticated users to view all active ventas"
ON public.ventas FOR SELECT
TO authenticated
USING (activa = true);

-- Permitir a los usuarios autenticados insertar sus propias ventas
CREATE POLICY "Allow authenticated users to insert their own ventas"
ON public.ventas FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = usuario_id);

-- Permitir a los usuarios autenticados actualizar sus propias ventas
CREATE POLICY "Allow authenticated users to update their own ventas"
ON public.ventas FOR UPDATE
TO authenticated
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

-- Permitir a los usuarios autenticados eliminar (desactivar) sus propias ventas
CREATE POLICY "Allow authenticated users to delete their own ventas"
ON public.ventas FOR UPDATE
TO authenticated
USING (auth.uid() = usuario_id);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON public.ventas (fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_usuario_id ON public.ventas (usuario_id);
CREATE INDEX IF NOT EXISTS idx_ventas_activa ON public.ventas (activa);
CREATE INDEX IF NOT EXISTS idx_ventas_metodo_pago ON public.ventas (metodo_pago);
CREATE INDEX IF NOT EXISTS idx_ventas_receta_id ON public.ventas (receta_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ventas_updated_at 
    BEFORE UPDATE ON public.ventas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
