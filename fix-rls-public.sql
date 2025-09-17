-- Script para hacer la tabla productos_stock completamente pública
-- Ejecutar en la consola SQL de Supabase

-- 1. Eliminar política existente
DROP POLICY IF EXISTS "Allow all operations for productos_stock" ON public.productos_stock;

-- 2. Crear política pública (sin autenticación requerida)
CREATE POLICY "Allow public access to productos_stock"
ON public.productos_stock
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 3. Verificar que la política se creó correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'productos_stock';
