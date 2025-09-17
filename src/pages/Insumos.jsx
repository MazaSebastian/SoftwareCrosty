import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { obtenerInsumos, crearInsumo, actualizarInsumo, eliminarInsumo, obtenerHistorialPrecios, actualizarPrecioInsumo } from '../services/insumosService';

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
  
  &.danger {
    background: #722F37;
    color: #F5F5DC;
    
    &:hover {
      background: #F5F5DC;
      color: #722F37;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
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

const InsumosList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  
  .insumo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #E5E7EB;
    
    &:last-child {
      border-bottom: none;
    }
    
    .insumo-info {
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
    
    .insumo-precio {
      text-align: right;
      margin-right: 1rem;
      
      .precio-actual {
        font-weight: 700;
        font-size: 1.1rem;
        color: #10b981;
        margin-bottom: 0.25rem;
      }
      
      .unidad {
        font-size: 0.75rem;
        opacity: 0.8;
      }
    }
    
    .insumo-actions {
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
          background: rgba(255, 255, 255, 0.1);
        }
        
        &.edit:hover {
          color: #3b82f6;
        }
        
        &.delete:hover {
          color: #ef4444;
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
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  
  h2 {
    margin: 0 0 1.5rem 0;
    color: #1e293b;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
  
  label {
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
  }
  
  input, select, textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    background-color: white;
    color: #374151;
    min-height: 48px;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
  
  select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    padding-right: 2.5rem;
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const HistorialPrecios = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  .precio-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #E5E7EB;
    
    &:last-child {
      border-bottom: none;
    }
    
    .precio-info {
      .fecha {
        color: white;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .proveedor {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.85rem;
      }
    }
    
    .precio-valor {
      font-weight: 700;
      color: #10b981;
    }
  }
`;

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [historialPrecios, setHistorialPrecios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrecioModalOpen, setIsPrecioModalOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    unidad: 'kg',
    cantidad: '',
    precioActual: '',
    proveedor: '',
    descripcion: '',
    fechaUltimaCompra: ''
  });
  const [precioData, setPrecioData] = useState({
    precio: '',
    proveedor: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  useEffect(() => {
    cargarInsumos();
  }, []);

  const cargarInsumos = async () => {
    try {
      const insumosData = await obtenerInsumos();
      setInsumos(insumosData);
    } catch (error) {
      console.error('Error al cargar insumos:', error);
    }
  };

  const cargarHistorialPrecios = async (insumoId) => {
    try {
      const historial = await obtenerHistorialPrecios(insumoId);
      setHistorialPrecios(historial);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.precioActual || !formData.cantidad) return;

    try {
      const nuevoInsumo = await crearInsumo({
        ...formData,
        precioActual: parseFloat(formData.precioActual)
      });
      
      setInsumos(prev => [nuevoInsumo, ...prev]);
      setIsModalOpen(false);
      setFormData({
        nombre: '',
        categoria: '',
        unidad: 'kg',
        cantidad: '',
        precioActual: '',
        proveedor: '',
        descripcion: '',
        fechaUltimaCompra: ''
      });
    } catch (error) {
      console.error('Error al crear insumo:', error);
    }
  };

  const handlePrecioSubmit = async (e) => {
    e.preventDefault();
    if (!precioData.precio || !selectedInsumo) return;

    try {
      await actualizarPrecioInsumo(
        selectedInsumo.id, 
        parseFloat(precioData.precio),
        'compra',
        precioData.proveedor,
        1 // cantidad comprada
      );
      
      // Actualizar información adicional del insumo
      await actualizarInsumo(selectedInsumo.id, {
        proveedor: precioData.proveedor,
        fechaUltimaCompra: precioData.fecha
      });
      
      await cargarInsumos();
      await cargarHistorialPrecios(selectedInsumo.id);
      setIsPrecioModalOpen(false);
      setPrecioData({
        precio: '',
        proveedor: '',
        fecha: new Date().toISOString().split('T')[0],
        observaciones: ''
      });
    } catch (error) {
      console.error('Error al agregar precio:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este insumo?')) {
      try {
        await eliminarInsumo(id);
        await cargarInsumos();
      } catch (error) {
        console.error('Error al eliminar insumo:', error);
      }
    }
  };

  const handleEdit = (insumo) => {
    setFormData({
      nombre: insumo.nombre,
      categoria: insumo.categoria,
      unidad: insumo.unidad,
      precioActual: insumo.precioActual.toString(),
      proveedor: insumo.proveedor,
      descripcion: insumo.descripcion,
      fechaUltimaCompra: insumo.fechaUltimaCompra
    });
    setSelectedInsumo(insumo);
    setIsModalOpen(true);
  };

  const handleNuevoPrecio = (insumo) => {
    setSelectedInsumo(insumo);
    setPrecioData({
      precio: '',
      proveedor: insumo.proveedor,
      fecha: new Date().toISOString().split('T')[0],
      observaciones: ''
    });
    setIsPrecioModalOpen(true);
    cargarHistorialPrecios(insumo.id);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calcular estadísticas
  const totalInsumos = insumos.length;
  const categorias = [...new Set(insumos.map(i => i.categoria))].length;
  const precioPromedio = insumos.length > 0 
    ? insumos.reduce((sum, i) => sum + i.precioActual, 0) / insumos.length 
    : 0;

  return (
    <PageContainer>
      <Header>
        <div>
          <h1>Insumos</h1>
          <div className="subtitle">Control de ingredientes y precios</div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          ➕ Nuevo Insumo
        </Button>
      </Header>

      <StatsGrid>
        <StatCard className="info">
          <div className="stat-header">
            <div className="stat-title">Total Insumos</div>
            <div className="stat-icon">🥬</div>
          </div>
          <div className="stat-value">{totalInsumos}</div>
          <div className="stat-subtitle">
            Ingredientes registrados
          </div>
        </StatCard>

        <StatCard className="success">
          <div className="stat-header">
            <div className="stat-title">Categorías</div>
            <div className="stat-icon">📂</div>
          </div>
          <div className="stat-value">{categorias}</div>
          <div className="stat-subtitle">
            Diferentes categorías
          </div>
        </StatCard>

        <StatCard className="warning">
          <div className="stat-header">
            <div className="stat-title">Precio Promedio</div>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-value">{formatCurrency(precioPromedio)}</div>
          <div className="stat-subtitle">
            Por unidad
          </div>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Section>
          <h3>📋 Lista de Insumos</h3>
          <InsumosList>
            {insumos.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '2rem' }}>
                No hay insumos registrados
              </div>
            ) : (
              insumos.map(insumo => (
                <div key={insumo.id} className="insumo-item">
                  <div className="insumo-info">
                    <div className="nombre">{insumo.nombre}</div>
                    <div className="detalles">
                      <span>{insumo.categoria}</span>
                      <span>{insumo.proveedor}</span>
                      <span>Última compra: {formatDate(insumo.fechaUltimaCompra)}</span>
                    </div>
                  </div>
                  <div className="insumo-precio">
                    <div className="precio-actual">{formatCurrency(insumo.precioActual)}</div>
                    <div className="unidad">por {insumo.unidad}</div>
                  </div>
                  <div className="insumo-actions">
                    <button 
                      className="edit" 
                      onClick={() => handleNuevoPrecio(insumo)}
                      title="Actualizar Precio"
                    >
                      💰
                    </button>
                    <button 
                      className="edit" 
                      onClick={() => handleEdit(insumo)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete" 
                      onClick={() => handleDelete(insumo.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </InsumosList>
        </Section>

        <Section>
          <h3>📈 Historial de Precios</h3>
          {selectedInsumo ? (
            <div>
              <div style={{ 
                marginBottom: '1rem', 
                padding: '0.75rem', 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ color: 'white', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {selectedInsumo.nombre}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                  Precio actual: {formatCurrency(selectedInsumo.precioActual)} por {selectedInsumo.unidad}
                </div>
              </div>
              <HistorialPrecios>
                {historialPrecios.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '1rem' }}>
                    No hay historial de precios
                  </div>
                ) : (
                  historialPrecios.map(precio => (
                    <div key={precio.id} className="precio-item">
                      <div className="precio-info">
                        <div className="fecha">{formatDate(precio.fecha)}</div>
                        <div className="proveedor">{precio.proveedor}</div>
                      </div>
                      <div className="precio-valor">{formatCurrency(precio.precio)}</div>
                    </div>
                  ))
                )}
              </HistorialPrecios>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '2rem' }}>
              Selecciona un insumo para ver su historial de precios
            </div>
          )}
        </Section>
      </ContentGrid>

      {/* Modal para nuevo/editar insumo */}
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <h2>{selectedInsumo ? 'Editar Insumo' : 'Nuevo Insumo'}</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Nombre del Insumo *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Harina 000, Pollo, Queso Muzzarella"
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <label>Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="harinas">Harinas</option>
                  <option value="carnes">Carnes</option>
                  <option value="lacteos">Lácteos</option>
                  <option value="vegetales">Vegetales</option>
                  <option value="condimentos">Condimentos</option>
                  <option value="otros">Otros</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Unidad de Medida *</label>
                <select
                  value={formData.unidad}
                  onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                  required
                  style={{
                    border: '2px solid #722F37',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <option value="kg">Kilogramo (kg)</option>
                  <option value="g">Gramo (g)</option>
                  <option value="l">Litro (l)</option>
                  <option value="ml">Mililitro (ml)</option>
                  <option value="unidad">Unidad</option>
                  <option value="paquete">Paquete</option>
                </select>
                <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  Selecciona la unidad de medida del insumo
                </small>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <label>Cantidad Comprada *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Precio Actual *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precioActual}
                  onChange={(e) => setFormData({ ...formData, precioActual: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Proveedor</label>
                <input
                  type="text"
                  value={formData.proveedor}
                  onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                  placeholder="Nombre del proveedor"
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <label>Fecha de Última Compra</label>
              <input
                type="date"
                value={formData.fechaUltimaCompra}
                onChange={(e) => setFormData({ ...formData, fechaUltimaCompra: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Detalles adicionales del insumo..."
              />
            </FormGroup>

            <ModalActions>
              <Button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedInsumo(null);
                  setFormData({
                    nombre: '',
                    categoria: '',
                    unidad: 'kg',
                    precioActual: '',
                    proveedor: '',
                    descripcion: '',
                    fechaUltimaCompra: ''
                  });
                }}
                className="secondary"
              >
                Cancelar
              </Button>
              <Button type="submit">
                {selectedInsumo ? 'Actualizar' : 'Crear'} Insumo
              </Button>
            </ModalActions>
          </Form>
        </ModalContent>
      </Modal>

      {/* Modal para nuevo precio */}
      <Modal isOpen={isPrecioModalOpen}>
        <ModalContent>
          <h2>Actualizar Precio - {selectedInsumo?.nombre}</h2>
          <Form onSubmit={handlePrecioSubmit}>
            <FormRow>
              <FormGroup>
                <label>Nuevo Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={precioData.precio}
                  onChange={(e) => setPrecioData({ ...precioData, precio: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Proveedor</label>
                <input
                  type="text"
                  value={precioData.proveedor}
                  onChange={(e) => setPrecioData({ ...precioData, proveedor: e.target.value })}
                  placeholder="Nombre del proveedor"
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <label>Fecha de Compra</label>
              <input
                type="date"
                value={precioData.fecha}
                onChange={(e) => setPrecioData({ ...precioData, fecha: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Observaciones</label>
              <textarea
                value={precioData.observaciones}
                onChange={(e) => setPrecioData({ ...precioData, observaciones: e.target.value })}
                placeholder="Notas sobre este precio..."
              />
            </FormGroup>

            <ModalActions>
              <Button
                type="button"
                onClick={() => {
                  setIsPrecioModalOpen(false);
                  setSelectedInsumo(null);
                  setPrecioData({
                    precio: '',
                    proveedor: '',
                    fecha: new Date().toISOString().split('T')[0],
                    observaciones: ''
                  });
                }}
                className="secondary"
              >
                Cancelar
              </Button>
              <Button type="submit">
                Actualizar Precio
              </Button>
            </ModalActions>
          </Form>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Insumos;