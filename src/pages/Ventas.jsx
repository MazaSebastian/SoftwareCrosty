import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  obtenerVentas, 
  crearVenta, 
  eliminarVenta, 
  obtenerEstadisticasVentas,
  obtenerVentasHoy,
  obtenerVentasSemana,
  obtenerVentasMes,
  obtenerProductosDisponibles
} from '../services/ventasService';

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
  
  &.info {
    border-left: 4px solid #E5E7EB;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
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

const VentasList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  
  .venta-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #E5E7EB;
    
    &:last-child {
      border-bottom: none;
    }
    
    .venta-info {
      flex: 1;
      
      .producto {
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
    
    .venta-monto {
      text-align: right;
      
      .monto {
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
        color: #722F37;
      }
      
      .metodo {
        font-size: 0.75rem;
        color: #6B7280;
      }
    }
    
    .venta-actions {
      margin-left: 1rem;
      
      button {
        background: none;
        border: none;
        color: #6B7280;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.2s ease;
        
        &:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
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

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tipo: '',
    recetaId: '',
    recetaNombre: '',
    cantidad: 1,
    precioUnitario: 0,
    metodoPago: 'efectivo',
    cliente: '',
    notas: '',
    usuarioId: 'socio1',
    usuarioNombre: 'Socio 1'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [ventasData, estadisticasData, productosData] = await Promise.all([
        obtenerVentas(),
        obtenerEstadisticasVentas(),
        obtenerProductosDisponibles()
      ]);
      
      setVentas(ventasData);
      setEstadisticas(estadisticasData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const subtotal = formData.cantidad * formData.precioUnitario;
      const nuevaVenta = {
        ...formData,
        subtotal,
        fecha: new Date().toISOString()
      };
      
      await crearVenta(nuevaVenta);
      await cargarDatos();
      setShowModal(false);
      setFormData({
        tipo: '',
        recetaId: '',
        recetaNombre: '',
        cantidad: 1,
        precioUnitario: 0,
        metodoPago: 'efectivo',
        cliente: '',
        notas: '',
        usuarioId: 'socio1',
        usuarioNombre: 'Socio 1'
      });
    } catch (error) {
      console.error('Error creando venta:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      try {
        await eliminarVenta(id);
        await cargarDatos();
      } catch (error) {
        console.error('Error eliminando venta:', error);
      }
    }
  };

  const handleProductoChange = (productoId) => {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
      setFormData({
        ...formData,
        tipo: producto.tipo,
        recetaId: producto.id,
        recetaNombre: producto.nombre,
        precioUnitario: producto.precio
      });
    }
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
          <h1>Ventas</h1>
        </Header>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
          Cargando datos de ventas...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <div>
          <h1>Ventas</h1>
          <div className="subtitle">Registro y control de ventas</div>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <span>🛒</span>
          Nueva Venta
        </Button>
      </Header>

      <StatsGrid>
        <StatCard className="success">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <span className="stat-label">Ventas Hoy</span>
          </div>
          <div className="stat-value">{estadisticas?.totalVentas || 0}</div>
          <div className="stat-subtitle">{formatCurrency(estadisticas?.totalIngresos || 0)}</div>
        </StatCard>

        <StatCard className="info">
          <div className="stat-header">
            <span className="stat-icon">💳</span>
            <span className="stat-label">Efectivo</span>
          </div>
          <div className="stat-value">{estadisticas?.ventasEfectivo || 0}</div>
          <div className="stat-subtitle">{formatCurrency(estadisticas?.ingresosEfectivo || 0)}</div>
        </StatCard>

        <StatCard className="warning">
          <div className="stat-header">
            <span className="stat-icon">🏦</span>
            <span className="stat-label">Transferencia</span>
          </div>
          <div className="stat-value">{estadisticas?.ventasTransferencia || 0}</div>
          <div className="stat-subtitle">{formatCurrency(estadisticas?.ingresosTransferencia || 0)}</div>
        </StatCard>

        <StatCard className="info">
          <div className="stat-header">
            <span className="stat-icon">📊</span>
            <span className="stat-label">Promedio</span>
          </div>
          <div className="stat-value">{formatCurrency(estadisticas?.promedioVenta || 0)}</div>
          <div className="stat-subtitle">Por venta</div>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Section>
          <h3>📋 Historial de Ventas</h3>
          <VentasList>
            {ventas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                No hay ventas registradas
              </div>
            ) : (
              ventas.map(venta => (
                <div key={venta.id} className="venta-item">
                  <div className="venta-info">
                    <div className="producto">{venta.recetaNombre}</div>
                    <div className="detalles">
                      <span>Cantidad: {venta.cantidad}</span>
                      <span>Cliente: {venta.cliente}</span>
                      <span>Fecha: {formatDate(venta.fecha)}</span>
                      {venta.notas && <span>Notas: {venta.notas}</span>}
                    </div>
                  </div>
                  <div className="venta-monto">
                    <div className="monto">{formatCurrency(venta.subtotal)}</div>
                    <div className="metodo">{venta.metodoPago}</div>
                  </div>
                  <div className="venta-actions">
                    <button onClick={() => handleDelete(venta.id)} title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </VentasList>
        </Section>
      </ContentGrid>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#722F37', marginBottom: '1.5rem' }}>Nueva Venta</h2>
            <Form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Producto</label>
                <select
                  value={formData.recetaId}
                  onChange={(e) => handleProductoChange(e.target.value)}
                  required
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} - {formatCurrency(producto.precio)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
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
                <div className="form-group">
                  <label>Precio Unitario</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.precioUnitario}
                    onChange={(e) => setFormData({ ...formData, precioUnitario: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Método de Pago</label>
                <select
                  value={formData.metodoPago}
                  onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                  required
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cliente</label>
                <input
                  type="text"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  placeholder="Nombre del cliente"
                />
              </div>

              <div className="form-group">
                <label>Notas</label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Notas adicionales..."
                />
              </div>

              <div className="form-actions">
                <Button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Registrar Venta
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Ventas;
