-- Crear tabla ventas simple (sin referencias a otras tablas)
CREATE TABLE IF NOT EXISTS public.ventas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha timestamp with time zone NOT NULL DEFAULT now(),
    tipo varchar(50) NOT NULL,
    receta_id uuid,
    receta_nombre varchar(255) NOT NULL,
    cantidad integer NOT NULL DEFAULT 1,
    precio_unitario decimal(10,2) NOT NULL DEFAULT 0,
    subtotal decimal(10,2) NOT NULL DEFAULT 0,
    metodo_pago varchar(20) NOT NULL DEFAULT 'efectivo',
    cliente varchar(255),
    notas text,
    usuario_id uuid,
    usuario_nombre varchar(255),
    activa boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;

-- Política simple: permitir todo a usuarios autenticados
CREATE POLICY "Allow all operations for authenticated users"
ON public.ventas
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Índices básicos
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON public.ventas (fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_usuario_id ON public.ventas (usuario_id);
