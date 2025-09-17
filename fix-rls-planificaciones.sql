-- Script para configurar las políticas RLS de planificaciones
-- Ejecutar en la consola SQL de Supabase

-- 1. Habilitar RLS en las tablas
ALTER TABLE public.planificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planificaciones_tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planificaciones_templates ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes (si existen)
DROP POLICY IF EXISTS "Allow all operations for planificaciones" ON public.planificaciones;
DROP POLICY IF EXISTS "Allow all operations for planificaciones_tareas" ON public.planificaciones_tareas;
DROP POLICY IF EXISTS "Allow all operations for planificaciones_templates" ON public.planificaciones_templates;

-- 3. Crear políticas públicas para desarrollo (sin autenticación requerida)
CREATE POLICY "Allow public access to planificaciones"
ON public.planificaciones
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public access to planificaciones_tareas"
ON public.planificaciones_tareas
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public access to planificaciones_templates"
ON public.planificaciones_templates
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 4. Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('planificaciones', 'planificaciones_tareas', 'planificaciones_templates')
ORDER BY tablename, policyname;
