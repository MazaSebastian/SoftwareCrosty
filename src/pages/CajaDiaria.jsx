import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import OptimizedInput from '../components/OptimizedInput';
import OptimizedSelect from '../components/OptimizedSelect';
import ImportacionCSV from '../components/ImportacionCSV';
import { 
  obtenerMovimientosCaja, 
  crearMovimientoCaja, 
  obtenerSaldosUsuarios, 
  eliminarMovimientoCaja,
  obtenerSaldoGeneralCrosty,
  obtenerResumenCajaCompleto
} from '../services/cajaService';
import { useApp } from '../context/AppContext';
import UsuarioSelector from '../components/UsuarioSelector';
import { 
  FormContainer, 
  FormGroup, 
  FormRow, 
  FormActions, 
  FormButton 
} from '../components/FormResponsive';

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
  grid-template-columns: 1fr 1fr;
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

const MovimientosList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  .movimiento-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #E5E7EB;
    
    &:last-child {
      border-bottom: none;
    }
    
    .movimiento-info {
      flex: 1;
      
      .concepto {
        color: #722F37;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .detalles {
        color: #6B7280;
        font-size: 0.85rem;
      }
    }
    
    .movimiento-monto {
      text-align: right;
      
      .monto {
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
      }
      
      .metodo {
        font-size: 0.75rem;
        color: #6B7280;
      }
    }
    
    .movimiento-actions {
      margin-left: 1rem;
      
      button {
        background: none;
        border: none;
        color: #6B7280;
        cursor: pointer;
        padding: 0.25rem;
        
        &:hover {
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
  max-width: 500px;
  
  h2 {
    margin: 0 0 1.5rem 0;
    color: #1e293b;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;


const CajaDiaria = () => {
  const { actualizarEstadisticas } = useApp();
  const [movimientos, setMovimientos] = useState([]);
  const [saldos, setSaldos] = useState([]);
  const [saldoGeneral, setSaldoGeneral] = useState(null);
  const [resumenCompleto, setResumenCompleto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [mostrarImportacion, setMostrarImportacion] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'ingreso',
    concepto: '',
    monto: '',
    metodo: 'efectivo',
    descripcion: '',
    categoria: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [movimientosData, resumenData] = await Promise.all([
        obtenerMovimientosCaja(),
        obtenerResumenCajaCompleto()
      ]);
      setMovimientos(movimientosData);
      setSaldos(resumenData.saldosUsuarios);
      setSaldoGeneral(resumenData.saldoGeneral);
      setResumenCompleto(resumenData);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleImportacionCompleta = () => {
    cargarDatos(); // Recargar datos después de importación
    setMostrarImportacion(false); // Ocultar panel de importación
  };

  const handleUsuarioChange = (usuario) => {
    setUsuarioActual(usuario);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.concepto || !formData.monto) return;

    try {
      const nuevoMovimiento = await crearMovimientoCaja({
        ...formData,
        monto: parseFloat(formData.monto)
      });
      
      setMovimientos(prev => [nuevoMovimiento, ...prev]);
      await cargarDatos();
      await actualizarEstadisticas();
      setIsModalOpen(false);
      setFormData({
        tipo: 'ingreso',
        concepto: '',
        monto: '',
        metodo: 'efectivo',
        descripcion: '',
        categoria: ''
      });
    } catch (error) {
      console.error('Error al crear movimiento:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este movimiento?')) {
      try {
        await eliminarMovimientoCaja(id);
        await cargarDatos();
        await actualizarEstadisticas();
      } catch (error) {
        console.error('Error al eliminar movimiento:', error);
      }
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular totales
  const totalIngresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + m.monto, 0);
  
  const totalEgresos = movimientos
    .filter(m => m.tipo === 'egreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const saldoTotal = totalIngresos - totalEgresos;

  return (
    <PageContainer>
      <Header>
        <div>
          <h1>Caja Diaria</h1>
          <div className="subtitle">Control de ingresos y egresos diarios</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={() => setIsModalOpen(true)}>
            ➕ Nuevo Movimiento
          </Button>
          <Button 
            onClick={() => setMostrarImportacion(!mostrarImportacion)}
            style={{ background: '#10B981' }}
          >
            📊 {mostrarImportacion ? 'Ocultar Importación' : 'Importar CSV'}
          </Button>
        </div>
      </Header>

      <UsuarioSelector onUsuarioChange={handleUsuarioChange} />

      {mostrarImportacion && (
        <ImportacionCSV onImportacionCompleta={handleImportacionCompleta} />
      )}

      <StatsGrid>
        <StatCard className="success">
          <div className="stat-header">
            <div className="stat-title">Saldo General CROSTY</div>
            <div className="stat-icon">🏢</div>
          </div>
          <div className="stat-value">
            {saldoGeneral ? formatCurrency(saldoGeneral.saldoTotal) : formatCurrency(0)}
          </div>
          <div className="stat-subtitle">
            {saldoGeneral ? (
              <>
                Efectivo: {formatCurrency(saldoGeneral.saldoEfectivo)} • 
                Transferencia: {formatCurrency(saldoGeneral.saldoTransferencia)}
              </>
            ) : (
              'Cargando...'
            )}
          </div>
        </StatCard>

        <StatCard className="info">
          <div className="stat-header">
            <div className="stat-title">Total Ingresos</div>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-value">
            {saldoGeneral ? formatCurrency(saldoGeneral.totalIngresos) : formatCurrency(totalIngresos)}
          </div>
          <div className="stat-subtitle">
            {movimientos.filter(m => m.tipo === 'ingreso').length} movimientos
          </div>
        </StatCard>

        <StatCard className="warning">
          <div className="stat-header">
            <div className="stat-title">Total Egresos</div>
            <div className="stat-icon">💸</div>
          </div>
          <div className="stat-value">
            {saldoGeneral ? formatCurrency(saldoGeneral.totalEgresos) : formatCurrency(totalEgresos)}
          </div>
          <div className="stat-subtitle">
            {movimientos.filter(m => m.tipo === 'egreso').length} movimientos
          </div>
        </StatCard>

        <StatCard className={saldoGeneral?.utilidad >= 0 ? 'success' : 'danger'}>
          <div className="stat-header">
            <div className="stat-title">Utilidad</div>
            <div className="stat-icon">📈</div>
          </div>
          <div className="stat-value">
            {saldoGeneral ? formatCurrency(saldoGeneral.utilidad) : formatCurrency(saldoTotal)}
          </div>
          <div className="stat-subtitle">
            {saldoGeneral?.utilidad >= 0 ? 'Positiva' : 'Negativa'}
          </div>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Section>
          <h3>📋 Movimientos Recientes</h3>
          <MovimientosList>
            {movimientos.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '2rem' }}>
                No hay movimientos registrados
              </div>
            ) : (
              movimientos.map(movimiento => (
                <div key={movimiento.id} className="movimiento-item">
                  <div className="movimiento-info">
                    <div className="concepto">{movimiento.concepto}</div>
                    <div className="detalles">
                      {formatDate(movimiento.fecha)} • {movimiento.usuarioNombre}
                      {movimiento.descripcion && ` • ${movimiento.descripcion}`}
                    </div>
                  </div>
                  <div className="movimiento-monto">
                    <div className={`monto ${movimiento.tipo === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                      {movimiento.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(movimiento.monto)}
                    </div>
                    <div className="metodo">{movimiento.metodo}</div>
                  </div>
                  <div className="movimiento-actions">
                    <button onClick={() => handleDelete(movimiento.id)} title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </MovimientosList>
        </Section>

        <Section>
          <h3>👥 Saldos por Usuario</h3>
          <div>
            {saldos.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '2rem' }}>
                No hay saldos registrados
              </div>
            ) : (
              saldos.map(saldo => (
                <div key={saldo.usuarioId} style={{ 
                  padding: '1rem', 
                  marginBottom: '1rem', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ 
                      color: '#333333', 
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>
                      {saldo.usuarioNombre || 'Usuario sin nombre'}
                    </div>
                    <div style={{ 
                      color: saldo.saldoTotal >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}>
                      {formatCurrency(saldo.saldoTotal)}
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '0.25rem',
                    fontSize: '0.85rem',
                    color: '#666666'
                  }}>
                    <div>Efectivo: {formatCurrency(saldo.saldoEfectivo)}</div>
                    <div>Transferencia: {formatCurrency(saldo.saldoTransferencia)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Section>
      </ContentGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <h2>Nuevo Movimiento</h2>
          <FormContainer onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <label>Tipo de Movimiento</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  required
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Método de Pago</label>
                <select
                  value={formData.metodo}
                  onChange={(e) => setFormData({ ...formData, metodo: e.target.value })}
                  required
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <label>Concepto *</label>
              <input
                type="text"
                value={formData.concepto}
                onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                placeholder="Ej: Venta de tartas, Compra de insumos"
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Monto *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                placeholder="0.00"
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="">Seleccionar categoría</option>
                <option value="ventas">Ventas</option>
                <option value="insumos">Insumos</option>
                <option value="servicios">Servicios</option>
                <option value="alquiler">Alquiler</option>
                <option value="otros">Otros</option>
              </select>
            </FormGroup>

            <FormGroup>
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Detalles adicionales del movimiento..."
              />
            </FormGroup>

            <FormActions>
              <FormButton
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="secondary"
              >
                Cancelar
              </FormButton>
              <FormButton type="submit" className="primary">
                Guardar Movimiento
              </FormButton>
            </FormActions>
          </FormContainer>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default CajaDiaria;
