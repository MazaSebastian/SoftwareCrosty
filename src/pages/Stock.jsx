import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  obtenerProductosStock,
  obtenerProductoStockPorId,
  crearProductoStock,
  actualizarProductoStock,
  eliminarProductoStock,
  obtenerMovimientosStock,
  registrarMovimientoStock,
  obtenerProductosStockBajo,
  obtenerEstadisticasStock,
  obtenerMovimientosRecientes,
  ajustarStock,
  obtenerHistorialStock
} from '../services/stockService';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #FFFFFF;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #722F37;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .subtitle {
    color: #6B7280;
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const Button = styled.button`
  background: #722F37;
  border: 1px solid #E5E7EB;
  color: #F5F5DC;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #F5F5DC;
    color: #722F37;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(114, 47, 55, 0.3);
  }
  
  &.secondary {
    background: #6B7280;
    color: #F5F5DC;
    
    &:hover {
      background: #F5F5DC;
      color: #6B7280;
    }
  }
  
  &.success {
    background: #722F37;
    color: #F5F5DC;
    
    &:hover {
      background: #F5F5DC;
      color: #722F37;
    }
  }
  
  &.warning {
    background: #E5E7EB;
    color: #722F37;
    
    &:hover {
      background: #722F37;
      color: #F5F5DC;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  color: #722F37;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #722F37;
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    
    .stat-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #722F37;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .stat-icon {
      font-size: 1.5rem;
      color: #722F37;
    }
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #722F37;
  }
  
  .stat-subtitle {
    font-size: 0.85rem;
    color: #6B7280;
  }
  
  &.success {
    border-left: 4px solid #722F37;
  }
  
  &.warning {
    border-left: 4px solid #E5E7EB;
  }
  
  &.danger {
    border-left: 4px solid #722F37;
  }
  
  &.info {
    border-left: 4px solid #E5E7EB;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  
  h3 {
    color: #722F37;
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const ProductosList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  
  .producto-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #E5E7EB;
    
    &:last-child {
      border-bottom: none;
    }
    
    .producto-info {
      flex: 1;
      
      .nombre {
        color: #722F37;
        font-weight: 600;
        margin-bottom: 0.25rem;
        font-size: 1.1rem;
      }
      
      .detalles {
        color: #6B7280;
        font-size: 0.85rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
    }
    
    .producto-stock {
      text-align: right;
      margin-right: 1rem;
      
      .stock-actual {
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
        color: ${props => props.stockBajo ? '#DC2626' : '#722F37'};
      }
      
      .stock-minimo {
        font-size: 0.75rem;
        color: #6B7280;
      }
    }
    
    .producto-actions {
      display: flex;
      gap: 0.5rem;
      
      button {
        background: none;
        border: none;
        color: #6B7280;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.2s ease;
        
        &:hover {
          background: rgba(114, 47, 55, 0.1);
          color: #722F37;
        }
        
        &.danger:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
      }
    }
  }
`;

const MovimientosList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  .movimiento-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #E5E7EB;
    
    &:last-child {
      border-bottom: none;
    }
    
    .movimiento-icon {
      font-size: 1.2rem;
      color: ${props => {
        switch(props.tipo) {
          case 'entrada': return '#10b981';
          case 'salida': return '#ef4444';
          case 'ajuste': return '#f59e0b';
          default: return '#6B7280';
        }
      }};
    }
    
    .movimiento-content {
      flex: 1;
      
      .movimiento-title {
        color: #722F37;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .movimiento-details {
        color: #6B7280;
        font-size: 0.85rem;
      }
    }
    
    .movimiento-cantidad {
      text-align: right;
      
      .cantidad {
        font-weight: 700;
        color: ${props => {
          switch(props.tipo) {
            case 'entrada': return '#10b981';
            case 'salida': return '#ef4444';
            case 'ajuste': return '#f59e0b';
            default: return '#6B7280';
          }
        }};
      }
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    label {
      color: #722F37;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    input, select, textarea {
      padding: 0.75rem;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #722F37;
        box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
      }
    }
    
    textarea {
      resize: vertical;
      min-height: 80px;
    }
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }
`;

const Stock = () => {
  const [productos, setProductos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('producto');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    stockActual: 0,
    stockMinimo: 0,
    stockMaximo: 0,
    precioVenta: 0,
    costoUnitario: 0,
    ubicacion: '',
    activo: true
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [productosData, estadisticasData, movimientosData, stockBajoData] = await Promise.all([
        obtenerProductosStock(),
        obtenerEstadisticasStock(),
        obtenerMovimientosRecientes(10),
        obtenerProductosStockBajo()
      ]);
      
      setProductos(productosData);
      setEstadisticas(estadisticasData);
      setMovimientos(movimientosData);
      setProductosStockBajo(stockBajoData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'producto') {
        await crearProductoStock(formData);
      } else if (modalType === 'movimiento') {
        await registrarMovimientoStock({
          ...formData,
          productoId: selectedProducto.id,
          productoNombre: selectedProducto.nombre
        });
      }
      
      await cargarDatos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al procesar la operación');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await eliminarProductoStock(id);
        await cargarDatos();
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  const handleAjustarStock = async (producto) => {
    const nuevaCantidad = prompt(`Ajustar stock de ${producto.nombre} (actual: ${producto.stockActual}):`, producto.stockActual);
    if (nuevaCantidad !== null && !isNaN(nuevaCantidad)) {
      try {
        await ajustarStock(producto.id, parseInt(nuevaCantidad), 'Ajuste manual', '');
        await cargarDatos();
      } catch (error) {
        console.error('Error ajustando stock:', error);
        alert(error.message || 'Error al ajustar stock');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      categoria: '',
      stockActual: 0,
      stockMinimo: 0,
      stockMaximo: 0,
      precioVenta: 0,
      costoUnitario: 0,
      ubicacion: '',
      activo: true
    });
    setSelectedProducto(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <h1>Control de Stock</h1>
        </Header>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
          Cargando datos de stock...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <div>
          <h1>Control de Stock</h1>
          <div className="subtitle">Gestión de inventario de productos</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={() => {
            setModalType('producto');
            setShowModal(true);
          }}>
            <span>📦</span>
            Nuevo Producto
          </Button>
        </div>
      </Header>

      <StatsGrid>
        <StatCard className="success">
          <div className="stat-header">
            <span className="stat-icon">📦</span>
            <span className="stat-label">Total Productos</span>
          </div>
          <div className="stat-value">{estadisticas?.totalProductos || 0}</div>
          <div className="stat-subtitle">En inventario</div>
        </StatCard>

        <StatCard className="danger">
          <div className="stat-header">
            <span className="stat-icon">⚠️</span>
            <span className="stat-label">Stock Bajo</span>
          </div>
          <div className="stat-value">{estadisticas?.productosStockBajo || 0}</div>
          <div className="stat-subtitle">Productos</div>
        </StatCard>

        <StatCard className="info">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <span className="stat-label">Valor Stock</span>
          </div>
          <div className="stat-value">{formatCurrency(estadisticas?.valorTotalStock || 0)}</div>
          <div className="stat-subtitle">Costo total</div>
        </StatCard>

        <StatCard className="warning">
          <div className="stat-header">
            <span className="stat-icon">📈</span>
            <span className="stat-label">Margen</span>
          </div>
          <div className="stat-value">{formatCurrency(estadisticas?.margenTotal || 0)}</div>
          <div className="stat-subtitle">Potencial</div>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Section>
          <h3>📦 Inventario de Productos</h3>
          <ProductosList>
            {productos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                No hay productos en stock
              </div>
            ) : (
              productos.map(producto => (
                <div key={producto.id} className="producto-item">
                  <div className="producto-info">
                    <div className="nombre">{producto.nombre}</div>
                    <div className="detalles">
                      <span>Categoría: {producto.categoria}</span>
                      <span>Ubicación: {producto.ubicacion}</span>
                      <span>Precio: {formatCurrency(producto.precioVenta)}</span>
                    </div>
                  </div>
                  <div className="producto-stock">
                    <div className="stock-actual" stockBajo={producto.stockActual <= producto.stockMinimo}>
                      {producto.stockActual}
                    </div>
                    <div className="stock-minimo">Mín: {producto.stockMinimo}</div>
                  </div>
                  <div className="producto-actions">
                    <button 
                      onClick={() => {
                        setSelectedProducto(producto);
                        setModalType('movimiento');
                        setFormData({
                          tipo: 'entrada',
                          cantidad: 0,
                          motivo: 'Producción',
                          notas: ''
                        });
                        setShowModal(true);
                      }}
                      title="Registrar movimiento"
                    >
                      📝
                    </button>
                    <button 
                      onClick={() => handleAjustarStock(producto)}
                      title="Ajustar stock"
                    >
                      ⚖️
                    </button>
                    <button 
                      onClick={() => handleDelete(producto.id)}
                      className="danger"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </ProductosList>
        </Section>

        <Section>
          <h3>📋 Movimientos Recientes</h3>
          <MovimientosList>
            {movimientos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                No hay movimientos
              </div>
            ) : (
              movimientos.map(movimiento => (
                <div key={movimiento.id} className="movimiento-item">
                  <div className="movimiento-icon" tipo={movimiento.tipo}>
                    {movimiento.tipo === 'entrada' ? '📈' : 
                     movimiento.tipo === 'salida' ? '📉' : '⚖️'}
                  </div>
                  <div className="movimiento-content">
                    <div className="movimiento-title">{movimiento.productoNombre}</div>
                    <div className="movimiento-details">
                      {movimiento.motivo} • {formatDate(movimiento.fecha)}
                    </div>
                  </div>
                  <div className="movimiento-cantidad">
                    <div className="cantidad" tipo={movimiento.tipo}>
                      {movimiento.tipo === 'entrada' ? '+' : 
                       movimiento.tipo === 'salida' ? '-' : ''}{movimiento.cantidad}
                    </div>
                  </div>
                </div>
              ))
            )}
          </MovimientosList>
        </Section>
      </ContentGrid>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#722F37', marginBottom: '1.5rem' }}>
              {modalType === 'producto' ? 'Nuevo Producto' : 'Registrar Movimiento'}
            </h2>
            <Form onSubmit={handleSubmit}>
              {modalType === 'producto' ? (
                <>
                  <div className="form-group">
                    <label>Nombre del Producto</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Categoría</label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="Tartas Saladas">Tartas Saladas</option>
                        <option value="Pollos Condimentados">Pollos Condimentados</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Ubicación</label>
                      <input
                        type="text"
                        value={formData.ubicacion}
                        onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                        placeholder="Ej: Freezer A"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Stock Actual</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stockActual}
                        onChange={(e) => setFormData({ ...formData, stockActual: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock Mínimo</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stockMinimo}
                        onChange={(e) => setFormData({ ...formData, stockMinimo: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Precio de Venta</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.precioVenta}
                        onChange={(e) => setFormData({ ...formData, precioVenta: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Costo Unitario</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.costoUnitario}
                        onChange={(e) => setFormData({ ...formData, costoUnitario: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Producto</label>
                    <input
                      type="text"
                      value={selectedProducto?.nombre || ''}
                      disabled
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tipo de Movimiento</label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        required
                      >
                        <option value="entrada">Entrada</option>
                        <option value="salida">Salida</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.cantidad}
                        onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Motivo</label>
                    <select
                      value={formData.motivo}
                      onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                      required
                    >
                      <option value="Producción">Producción</option>
                      <option value="Venta">Venta</option>
                      <option value="Ajuste">Ajuste</option>
                      <option value="Devolución">Devolución</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Notas</label>
                    <textarea
                      value={formData.notas}
                      onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                      placeholder="Notas adicionales..."
                    />
                  </div>
                </>
              )}

              <div className="form-actions">
                <Button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {modalType === 'producto' ? 'Crear Producto' : 'Registrar Movimiento'}
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Stock;



