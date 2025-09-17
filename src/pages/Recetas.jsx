import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  obtenerRecetas, 
  crearReceta, 
  actualizarReceta, 
  eliminarReceta, 
  calcularCostoReceta,
  obtenerRecetasConCostos,
  escalarReceta,
  calcularCostoPorUnidad
} from '../services/recetasService';
import { obtenerInsumos } from '../services/insumosService';

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

const RecetasList = styled.div`
  display: grid;
  gap: 1rem;
  
  .receta-item {
    background: #FFFFFF;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    &:hover {
      background: #F5F5DC;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .receta-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
      
      .receta-info {
        flex: 1;
        
        .nombre {
          color: #722F37;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }
        
        .descripcion {
          color: #6B7280;
          font-size: 0.9rem;
        }
      }
      
      .receta-actions {
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
          
          &.edit:hover {
            color: #3b82f6;
          }
          
          &.delete:hover {
            color: #ef4444;
          }
        }
      }
    }
    
    .receta-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 0.75rem;
      
      .detail-item {
        .label {
          color: #666666;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        
        .value {
          color: #333333;
          font-weight: 600;
        }
      }
    }
    
    .ingredientes-list {
      .ingredientes-header {
        color: #333333;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      
      .ingredientes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.5rem;
        
        .ingrediente-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          font-size: 0.85rem;
          
          .ingrediente-nombre {
            color: #555555;
            font-weight: 500;
          }
          
          .ingrediente-cantidad {
            color: #333333;
            font-weight: 600;
          }
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
  max-width: 800px;
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
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
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

const IngredientesSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  
  h4 {
    margin: 0 0 1rem 0;
    color: #374151;
    font-size: 1rem;
    font-weight: 600;
  }
`;

const IngredienteItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 0.75rem;
  align-items: end;
  margin-bottom: 0.75rem;
  
  button {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const Recetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceta, setSelectedReceta] = useState(null);
  const [isEscaladoModalOpen, setIsEscaladoModalOpen] = useState(false);
  const [recetaParaEscalar, setRecetaParaEscalar] = useState(null);
  const [cantidadEscalado, setCantidadEscalado] = useState('');
  const [recetaEscalada, setRecetaEscalada] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidadBase: '1',
    unidadBase: 'tarta',
    categoria: '',
    ingredientes: []
  });
  const [nuevoIngrediente, setNuevoIngrediente] = useState({
    insumoId: '',
    cantidad: '',
    unidad: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      console.log('🔧 cargarDatos iniciado');
      
      const [insumosData] = await Promise.all([
        obtenerInsumos()
      ]);
      
      console.log('🔧 Insumos cargados:', {
        insumosCount: insumosData.length,
        insumos: insumosData
      });
      
      setInsumos(insumosData);
      
      // Obtener recetas con costos actualizados
      console.log('🔧 Obteniendo recetas con costos...');
      const recetasConCostos = await obtenerRecetasConCostos(insumosData);
      
      console.log('🔧 Recetas con costos:', {
        recetasCount: recetasConCostos.length,
        recetas: recetasConCostos
      });
      
      setRecetas(recetasConCostos);
      
      console.log('✅ Estados actualizados');
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔧 handleSubmit iniciado');
    console.log('🔧 formData:', formData);
    console.log('🔧 selectedReceta:', selectedReceta);
    
    if (!formData.nombre || !formData.cantidadBase || formData.ingredientes.length === 0) {
      console.log('❌ Validación fallida:', {
        nombre: formData.nombre,
        cantidadBase: formData.cantidadBase,
        ingredientesLength: formData.ingredientes.length
      });
      return;
    }

    try {
      const recetaData = {
        ...formData,
        cantidadBase: parseFloat(formData.cantidadBase),
        ingredientes: formData.ingredientes.map(ing => ({
          ...ing,
          cantidad: parseFloat(ing.cantidad)
        }))
      };

      console.log('🔧 recetaData preparado:', recetaData);

      if (selectedReceta) {
        console.log('🔧 Actualizando receta existente:', selectedReceta.id);
        const resultado = await actualizarReceta(selectedReceta.id, recetaData);
        console.log('✅ Receta actualizada:', resultado);
      } else {
        console.log('🔧 Creando nueva receta');
        const resultado = await crearReceta(recetaData);
        console.log('✅ Receta creada:', resultado);
      }
      
      console.log('🔧 Recargando datos...');
      await cargarDatos();
      console.log('✅ Datos recargados');
      
      setIsModalOpen(false);
      resetForm();
      console.log('✅ Modal cerrado y formulario reseteado');
    } catch (error) {
      console.error('❌ Error al guardar receta:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        formData: formData,
        selectedReceta: selectedReceta
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        console.log('🔧 Eliminando receta con ID:', id);
        await eliminarReceta(id);
        console.log('✅ Receta eliminada exitosamente');
        await cargarDatos();
        console.log('✅ Datos recargados');
      } catch (error) {
        console.error('❌ Error al eliminar receta:', error);
        alert('Error al eliminar la receta: ' + error.message);
      }
    }
  };

  const handleEscalarReceta = (receta, factor = 1) => {
    setRecetaParaEscalar(receta);
    setCantidadEscalado(factor.toString());
    setRecetaEscalada(null);
    setIsEscaladoModalOpen(true);
  };

  const handleCalcularEscalado = async () => {
    if (!recetaParaEscalar || !cantidadEscalado) return;
    
    try {
      const cantidad = parseFloat(cantidadEscalado);
      const recetaEscaladaData = await escalarReceta(recetaParaEscalar, cantidad);
      const costoTotal = await calcularCostoReceta(recetaEscaladaData, insumos);
      const costoPorUnidad = await calcularCostoPorUnidad(recetaEscaladaData, insumos);
      
      setRecetaEscalada({
        ...recetaEscaladaData,
        costoTotal,
        costoPorUnidad
      });
    } catch (error) {
      console.error('Error al escalar receta:', error);
    }
  };

  const handleEdit = (receta) => {
    setFormData({
      nombre: receta.nombre,
      descripcion: receta.descripcion,
      porciones: receta.porciones.toString(),
      categoria: receta.categoria,
      ingredientes: receta.ingredientes
    });
    setSelectedReceta(receta);
    setIsModalOpen(true);
  };

  const agregarIngrediente = () => {
    if (!nuevoIngrediente.insumoId || !nuevoIngrediente.cantidad || !nuevoIngrediente.unidad) return;

    const insumo = insumos.find(i => i.id === nuevoIngrediente.insumoId);
    if (!insumo) return;

    const ingrediente = {
      insumoId: nuevoIngrediente.insumoId,
      insumoNombre: insumo.nombre,
      cantidad: parseFloat(nuevoIngrediente.cantidad),
      unidad: nuevoIngrediente.unidad || insumo.unidad
    };

    setFormData(prev => ({
      ...prev,
      ingredientes: [...prev.ingredientes, ingrediente]
    }));

    setNuevoIngrediente({
      insumoId: '',
      cantidad: '',
      unidad: ''
    });
  };

  const eliminarIngrediente = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      cantidadBase: '1',
      unidadBase: 'tarta',
      categoria: '',
      ingredientes: []
    });
    setSelectedReceta(null);
    setNuevoIngrediente({
      insumoId: '',
      cantidad: '',
      unidad: ''
    });
  };

  const formatCurrency = (amount) => {
    // Para valores pequeños (menos de 1000), mostrar el valor completo
    if (amount < 1000) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
    
    // Para valores grandes, truncar a miles
    const truncatedAmount = Math.floor(amount / 1000) * 1000;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(truncatedAmount);
  };

  // Función específica para costos de recetas (sin .000)
  const formatCurrencyReceta = (amount) => {
    // Para valores pequeños (menos de 1000), mostrar el valor completo
    if (amount < 1000) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
    
    // Para valores grandes, truncar a miles y quitar ceros innecesarios
    const truncatedAmount = Math.floor(amount / 1000) * 1000;
    const formatted = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(truncatedAmount);
    
    // Quitar los ceros innecesarios al final (solo para costos de recetas)
    return formatted.replace(/\.000$/, '');
  };

  // Calcular estadísticas
  const totalRecetas = recetas.length;
  const categorias = [...new Set(recetas.map(r => r.categoria))].length;
  const costoPromedio = recetas.length > 0 
    ? recetas.reduce((sum, r) => sum + (r.costoTotal || 0), 0) / recetas.length 
    : 0;

  return (
    <PageContainer>
      <Header>
        <div>
          <h1>Recetas</h1>
          <div className="subtitle">Gestión de recetas y cálculo de costos</div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          ➕ Nueva Receta
        </Button>
      </Header>

      <StatsGrid>
        <StatCard className="info">
          <div className="stat-header">
            <div className="stat-title">Total Recetas</div>
            <div className="stat-icon">🍽️</div>
          </div>
          <div className="stat-value">{totalRecetas}</div>
          <div className="stat-subtitle">
            Recetas registradas
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
            <div className="stat-title">Costo Promedio</div>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-value">{formatCurrencyReceta(costoPromedio)}</div>
          <div className="stat-subtitle">
            Por receta
          </div>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Section>
          <h3>📋 Lista de Recetas</h3>
          <RecetasList>
            {recetas.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '2rem' }}>
                No hay recetas registradas
              </div>
            ) : (
              recetas.map(receta => (
                <div key={receta.id} className="receta-item">
                  <div className="receta-header">
                    <div className="receta-info">
                      <div className="nombre">{receta.nombre}</div>
                      <div className="descripcion">{receta.descripcion}</div>
                    </div>
                    <div className="receta-actions">
                      <button 
                        className="edit" 
                        onClick={() => handleEdit(receta)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="scale" 
                        onClick={() => handleEscalarReceta(receta)}
                        title="Escalar receta"
                      >
                        🔄
                      </button>
                      <button 
                        className="delete" 
                        onClick={() => handleDelete(receta.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="receta-details">
                    <div className="detail-item">
                      <div className="label">Cantidad Base</div>
                      <div className="value">{receta.cantidadBase} {receta.unidadBase}</div>
                    </div>
                    <div className="detail-item">
                      <div className="label">Costo Total</div>
                      <div className="value">{formatCurrencyReceta(receta.costoTotal || 0)}</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    marginBottom: '0.75rem',
                    justifyContent: 'center'
                  }}>
                    <button
                      onClick={() => handleEscalarReceta(receta, 1)}
                      style={{
                        background: '#722F37',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      x1
                    </button>
                    <button
                      onClick={() => handleEscalarReceta(receta, 5)}
                      style={{
                        background: '#722F37',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      x5
                    </button>
                    <button
                      onClick={() => handleEscalarReceta(receta, 10)}
                      style={{
                        background: '#722F37',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      x10
                    </button>
                  </div>
                  
                  <div className="ingredientes-list">
                    <div className="ingredientes-header">Ingredientes:</div>
                    <div className="ingredientes-grid">
                      {receta.ingredientes.map((ingrediente, index) => (
                        <div key={index} className="ingrediente-item">
                          <span className="ingrediente-nombre">{ingrediente.nombre || ingrediente.insumoNombre}</span>
                          <span className="ingrediente-cantidad">
                            {ingrediente.cantidad} {ingrediente.unidad}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </RecetasList>
        </Section>
      </ContentGrid>

      {/* Modal para nueva/editar receta */}
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <h2>{selectedReceta ? 'Editar Receta' : 'Nueva Receta'}</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Nombre de la Receta *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Tarta de Pollo, Pollo al Vacío"
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción de la receta..."
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <label>Cantidad Base *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={formData.cantidadBase}
                    onChange={(e) => setFormData({ ...formData, cantidadBase: e.target.value })}
                    placeholder="1"
                    required
                    style={{ flex: 1 }}
                  />
                  <select
                    value={formData.unidadBase}
                    onChange={(e) => setFormData({ ...formData, unidadBase: e.target.value })}
                    style={{ minWidth: '120px' }}
                  >
                    <option value="tarta">Tarta individual</option>
                    <option value="kg">Kilogramo (kg)</option>
                    <option value="g">Gramo (g)</option>
                    <option value="unidad">Unidad</option>
                    <option value="porcion">Porción</option>
                  </select>
                </div>
                <small style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                  Cantidad estándar: 1 tarta individual o 1kg de pollo
                </small>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <label>Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="">Seleccionar categoría</option>
                <option value="tartas">Tartas</option>
                <option value="pollos">Pollos</option>
                <option value="acompanamientos">Acompañamientos</option>
                <option value="otros">Otros</option>
              </select>
            </FormGroup>

            <IngredientesSection>
              <h4>Ingredientes</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', marginBottom: '1rem' }}>
                <select
                  value={nuevoIngrediente.insumoId}
                  onChange={(e) => {
                    const insumo = insumos.find(i => i.id === e.target.value);
                    setNuevoIngrediente({
                      ...nuevoIngrediente,
                      insumoId: e.target.value,
                      unidad: insumo?.unidad || ''
                    });
                  }}
                >
                  <option value="">Seleccionar ingrediente</option>
                  {insumos.map(insumo => {
                    console.log('🔧 Insumo en dropdown:', {
                      nombre: insumo.nombre,
                      precioActual: insumo.precioActual,
                      precio_unitario: insumo.precio_unitario,
                      unidad: insumo.unidad
                    });
                    return (
                      <option key={insumo.id} value={insumo.id}>
                        {insumo.nombre} - {formatCurrency(insumo.precioActual || insumo.precio_unitario || 0)}/{insumo.unidad}
                      </option>
                    );
                  })}
                </select>
                
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={nuevoIngrediente.cantidad}
                  onChange={(e) => setNuevoIngrediente({ ...nuevoIngrediente, cantidad: e.target.value })}
                  placeholder="Cantidad"
                />
                
                <select
                  value={nuevoIngrediente.unidad}
                  onChange={(e) => setNuevoIngrediente({ ...nuevoIngrediente, unidad: e.target.value })}
                  style={{
                    border: '2px solid #722F37',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <option value="">Seleccionar unidad</option>
                  <option value="kg">Kilogramo (kg)</option>
                  <option value="g">Gramo (g)</option>
                  <option value="l">Litro (l)</option>
                  <option value="ml">Mililitro (ml)</option>
                  <option value="unidad">Unidad</option>
                  <option value="paquete">Paquete</option>
                </select>
                
                <Button type="button" onClick={agregarIngrediente}>
                  ➕
                </Button>
              </div>

              {formData.ingredientes.map((ingrediente, index) => (
                <IngredienteItem key={index}>
                  <div>{ingrediente.insumoNombre}</div>
                  <div>{ingrediente.cantidad}</div>
                  <div>{ingrediente.unidad}</div>
                  <button type="button" onClick={() => eliminarIngrediente(index)}>
                    🗑️
                  </button>
                </IngredienteItem>
              ))}
            </IngredientesSection>

            <ModalActions>
              <Button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="secondary"
              >
                Cancelar
              </Button>
              <Button type="submit">
                {selectedReceta ? 'Actualizar' : 'Crear'} Receta
              </Button>
            </ModalActions>
          </Form>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Recetas;