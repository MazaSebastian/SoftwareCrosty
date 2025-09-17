import { supabase } from '../config/supabase';
import { TABLES } from '../config/supabase';
import { obtenerUsuarioActual } from './usuariosService';

export const stockSupabaseAdapter = {
  // Obtener todos los productos de stock
  async obtenerProductosStock(filtros = {}) {
    let query = supabase
      .from(TABLES.PRODUCTOS_STOCK)
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (filtros.categoria) {
      query = query.eq('categoria', filtros.categoria);
    }
    if (filtros.stockBajo) {
      query = query.lte('cantidad', filtros.stockMinimo || 10);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error al obtener productos de stock:', error);
      throw error;
    }
    return data.map(this.transformProductoFromSupabase);
  },

  // Crear un nuevo producto de stock
  async crearProductoStock(producto) {
    const usuarioActual = obtenerUsuarioActual();
    const productoData = {
      ...this.transformProductoToSupabase(producto),
      usuario_id: usuarioActual?.id || null,
      usuario_nombre: usuarioActual?.nombre || 'Desconocido',
    };

    const { data, error } = await supabase
      .from(TABLES.PRODUCTOS_STOCK)
      .insert(productoData)
      .select()
      .single();

    if (error) {
      console.error('Error al crear producto de stock:', error);
      throw error;
    }

    return this.transformProductoFromSupabase(data);
  },

  // Actualizar un producto de stock existente
  async actualizarProductoStock(id, datosActualizacion) {
    const updateData = this.transformProductoToSupabase(datosActualizacion);

    const { data, error } = await supabase
      .from(TABLES.PRODUCTOS_STOCK)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar producto de stock:', error);
      throw error;
    }
    return this.transformProductoFromSupabase(data);
  },

  // Eliminar un producto de stock (desactivar)
  async eliminarProductoStock(id) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTOS_STOCK)
      .update({ activo: false })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al eliminar producto de stock:', error);
      throw error;
    }
    return this.transformProductoFromSupabase(data);
  },

  // Obtener productos con stock bajo
  async obtenerProductosStockBajo(stockMinimo = 10) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTOS_STOCK)
      .select('*')
      .eq('activo', true)
      .lte('cantidad', stockMinimo)
      .order('cantidad', { ascending: true });

    if (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      throw error;
    }
    return data.map(this.transformProductoFromSupabase);
  },

  // Obtener estadísticas de stock
  async obtenerEstadisticasStock() {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTOS_STOCK)
      .select('*')
      .eq('activo', true);

    if (error) {
      console.error('Error al obtener estadísticas de stock:', error);
      throw error;
    }

    const productos = data.map(this.transformProductoFromSupabase);
    const totalProductos = productos.length;
    const productosStockBajo = productos.filter(p => p.cantidad <= p.stockMinimo).length;
    const categorias = [...new Set(productos.map(p => p.categoria))];

    return {
      totalProductos,
      productosStockBajo,
      categorias: categorias.length,
      productosPorCategoria: categorias.map(categoria => ({
        categoria,
        cantidad: productos.filter(p => p.categoria === categoria).length
      }))
    };
  },

  // Obtener productos por categoría
  async obtenerProductosPorCategoria(categoria) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTOS_STOCK)
      .select('*')
      .eq('activo', true)
      .eq('categoria', categoria)
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
    return data.map(this.transformProductoFromSupabase);
  },

  // Buscar productos
  async buscarProductos(termino) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTOS_STOCK)
      .select('*')
      .eq('activo', true)
      .or(`nombre.ilike.%${termino}%,categoria.ilike.%${termino}%`)
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
    return data.map(this.transformProductoFromSupabase);
  },

  // Transformar datos de Supabase a formato local
  transformProductoFromSupabase(data) {
    return {
      id: data.id,
      nombre: data.nombre,
      categoria: data.categoria,
      cantidad: data.cantidad,
      stockMinimo: data.stock_minimo,
      activo: data.activo,
      usuarioId: data.usuario_id,
      usuarioNombre: data.usuario_nombre,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  // Transformar datos locales a formato Supabase
  transformProductoToSupabase(data) {
    return {
      nombre: data.nombre,
      categoria: data.categoria,
      cantidad: data.cantidad,
      stock_minimo: data.stockMinimo,
      activo: data.activo !== false,
    };
  },
};

export default stockSupabaseAdapter;
