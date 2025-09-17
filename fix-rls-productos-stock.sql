-- Script para corregir las políticas RLS de productos_stock
-- Ejecutar en la consola SQL de Supabase

-- 1. Eliminar políticas existentes (si existen)
DROP POLICY IF EXISTS "Allow authenticated users to view all active productos_stock" ON public.productos_stock;
DROP POLICY IF EXISTS "Allow authenticated users to insert productos_stock" ON public.productos_stock;
DROP POLICY IF EXISTS "Allow authenticated users to update productos_stock" ON public.productos_stock;
DROP POLICY IF EXISTS "Allow authenticated users to delete productos_stock" ON public.productos_stock;

-- 2. Crear políticas más permisivas para desarrollo
CREATE POLICY "Allow all operations for productos_stock"
ON public.productos_stock
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'productos_stock';
