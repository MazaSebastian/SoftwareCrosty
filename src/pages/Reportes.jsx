import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  generarReporteVentas,
  generarReporteCaja,
  generarReporteInsumos,
  generarReporteRecetas,
  generarReporteGeneral,
  exportarReporte,
  obtenerDatosGraficos
} from '../services/reportesService';

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

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
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
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  background: #FFFFFF;
  color: #722F37;
  cursor: pointer;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #722F37;
    box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  background: #FFFFFF;
  color: #722F37;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #722F37;
    box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
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
  
  &.danger {
    border-left: 4px solid #722F37;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

const DataList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  .data-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #E5E7EB;
    
    &:last-child {
      border-bottom: none;
    }
    
    .data-label {
      color: #722F37;
      font-weight: 600;
    }
    
    .data-value {
      color: #6B7280;
      font-weight: 500;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #6B7280;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Reportes = () => {
  const [reporteActual, setReporteActual] = useState(null);
  const [tipoReporte, setTipoReporte] = useState('general');
  const [filtros, setFiltros] = useState({
    fechaInicio: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    generarReporte();
  }, [tipoReporte, filtros]);

  const generarReporte = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let reporte;
      
      switch (tipoReporte) {
        case 'ventas':
          reporte = await generarReporteVentas(filtros);
          break;
        case 'caja':
          reporte = await generarReporteCaja(filtros);
          break;
        case 'insumos':
          reporte = await generarReporteInsumos();
          break;
        case 'recetas':
          reporte = await generarReporteRecetas();
          break;
        case 'general':
        default:
          reporte = await generarReporteGeneral(filtros);
          break;
      }
      
      setReporteActual(reporte);
    } catch (error) {
      setError('Error al generar el reporte. Intenta nuevamente.');
      console.error('Error generando reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportar = async () => {
    if (!reporteActual) return;
    
    try {
      await exportarReporte(reporteActual, `reporte_${tipoReporte}`);
    } catch (error) {
      console.error('Error exportando reporte:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const renderResumenGeneral = () => {
    if (!reporteActual?.resumenGeneral) return null;
    
    const { resumenGeneral } = reporteActual;
    
    return (
      <StatsGrid>
        <StatCard className="success">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <span className="stat-label">Rentabilidad</span>
          </div>
          <div className="stat-value">{formatCurrency(resumenGeneral.rentabilidad)}</div>
          <div className="stat-subtitle">Ingresos - Gastos</div>
        </StatCard>

        <StatCard className="info">
          <div className="stat-header">
            <span className="stat-icon">📊</span>
            <span className="stat-label">Margen Bruto</span>
          </div>
          <div className="stat-value">{formatPercentage(resumenGeneral.margenBruto)}</div>
          <div className="stat-subtitle">Porcentaje de rentabilidad</div>
        </StatCard>

        <StatCard className="warning">
          <div className="stat-header">
            <span className="stat-icon">⚡</span>
            <span className="stat-label">Eficiencia</span>
          </div>
          <div className="stat-value">{resumenGeneral.eficienciaOperativa.toFixed(1)}</div>
          <div className="stat-subtitle">Ventas por receta</div>
        </StatCard>
      </StatsGrid>
    );
  };

  const renderResumenVentas = () => {
    if (!reporteActual?.ventas?.resumen) return null;
    
    const { resumen } = reporteActual.ventas;
    
    return (
      <StatsGrid>
        <StatCard className="success">
          <div className="stat-header">
            <span className="stat-icon">🛒</span>
            <span className="stat-label">Total Ventas</span>
          </div>
          <div className="stat-value">{resumen.totalVentas}</div>
          <div className="stat-subtitle">{formatCurrency(resumen.totalIngresos)}</div>
        </StatCard>

        <StatCard className="info">
          <div className="stat-header">
            <span className="stat-icon">💳</span>
            <span className="stat-label">Efectivo</span>
          </div>
          <div className="stat-value">{resumen.ventasEfectivo}</div>
          <div className="stat-subtitle">{formatCurrency(resumen.ingresosEfectivo)}</div>
        </StatCard>

        <StatCard className="warning">
          <div className="stat-header">
            <span className="stat-icon">🏦</span>
            <span className="stat-label">Transferencia</span>
          </div>
          <div className="stat-value">{resumen.ventasTransferencia}</div>
          <div className="stat-subtitle">{formatCurrency(resumen.ingresosTransferencia)}</div>
        </StatCard>

        <StatCard className="info">
          <div className="stat-header">
            <span className="stat-icon">📈</span>
            <span className="stat-label">Promedio</span>
          </div>
          <div className="stat-value">{formatCurrency(resumen.promedioVenta)}</div>
          <div className="stat-subtitle">Por venta</div>
        </StatCard>
      </StatsGrid>
    );
  };

  const renderAnalisisVentas = () => {
    if (!reporteActual?.ventas?.analisis) return null;
    
    const { analisis } = reporteActual.ventas;
    
    return (
      <ContentGrid>
        <Section>
          <h3>📊 Ventas por Producto</h3>
          <DataList>
            {Object.entries(analisis.ventasPorProducto).map(([producto, datos]) => (
              <div key={producto} className="data-item">
                <span className="data-label">{producto}</span>
                <span className="data-value">
                  {datos.cantidad} unidades - {formatCurrency(datos.monto)}
                </span>
              </div>
            ))}
          </DataList>
        </Section>

        <Section>
          <h3>💳 Ventas por Método de Pago</h3>
          <DataList>
            {Object.entries(analisis.ventasPorMetodoPago).map(([metodo, monto]) => (
              <div key={metodo} className="data-item">
                <span className="data-label">{metodo}</span>
                <span className="data-value">{formatCurrency(monto)}</span>
              </div>
            ))}
          </DataList>
        </Section>
      </ContentGrid>
    );
  };

  const renderResumenCaja = () => {
    if (!reporteActual?.caja?.resumen) return null;
    
    const { resumen } = reporteActual.caja;
    
    return (
      <StatsGrid>
        <StatCard className="success">
          <div className="stat-header">
            <span className="stat-icon">📈</span>
            <span className="stat-label">Total Ingresos</span>
          </div>
          <div className="stat-value">{formatCurrency(resumen.totalIngresos)}</div>
          <div className="stat-subtitle">En el período</div>
        </StatCard>

        <StatCard className="danger">
          <div className="stat-header">
            <span className="stat-icon">📉</span>
            <span className="stat-label">Total Gastos</span>
          </div>
          <div className="stat-value">{formatCurrency(resumen.totalGastos)}</div>
          <div className="stat-subtitle">En el período</div>
        </StatCard>

        <StatCard className={resumen.saldoNeto >= 0 ? 'success' : 'danger'}>
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <span className="stat-label">Saldo Neto</span>
          </div>
          <div className="stat-value">{formatCurrency(resumen.saldoNeto)}</div>
          <div className="stat-subtitle">Ingresos - Gastos</div>
        </StatCard>

        <StatCard className="info">
          <div className="stat-header">
            <span className="stat-icon">📋</span>
            <span className="stat-label">Movimientos</span>
          </div>
          <div className="stat-value">{resumen.cantidadMovimientos}</div>
          <div className="stat-subtitle">En el período</div>
        </StatCard>
      </StatsGrid>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <h1>Reportes</h1>
          <div className="subtitle">Análisis y reportes del negocio</div>
        </Header>
        <LoadingSpinner>
          Generando reporte...
        </LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <div>
          <h1>Reportes</h1>
          <div className="subtitle">Análisis y reportes del negocio</div>
        </div>
        <Button onClick={handleExportar} disabled={!reporteActual}>
          <span>📥</span>
          Exportar
        </Button>
      </Header>

      <Controls>
        <Select
          value={tipoReporte}
          onChange={(e) => setTipoReporte(e.target.value)}
        >
          <option value="general">Reporte General</option>
          <option value="ventas">Reporte de Ventas</option>
          <option value="caja">Reporte de Caja</option>
          <option value="insumos">Reporte de Insumos</option>
          <option value="recetas">Reporte de Recetas</option>
        </Select>

        <Input
          type="date"
          value={filtros.fechaInicio}
          onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
        />

        <Input
          type="date"
          value={filtros.fechaFin}
          onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
        />

        <Button onClick={generarReporte}>
          <span>🔄</span>
          Actualizar
        </Button>
      </Controls>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {tipoReporte === 'general' && renderResumenGeneral()}
      {tipoReporte === 'ventas' && renderResumenVentas()}
      {tipoReporte === 'caja' && renderResumenCaja()}

      {tipoReporte === 'ventas' && renderAnalisisVentas()}

      {reporteActual && (
        <Section>
          <h3>📋 Detalles del Reporte</h3>
          <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>
            <p><strong>Período:</strong> {new Date(filtros.fechaInicio).toLocaleDateString('es-AR')} - {new Date(filtros.fechaFin).toLocaleDateString('es-AR')}</p>
            <p><strong>Tipo:</strong> {tipoReporte.charAt(0).toUpperCase() + tipoReporte.slice(1)}</p>
            <p><strong>Generado:</strong> {new Date().toLocaleString('es-AR')}</p>
          </div>
        </Section>
      )}
    </PageContainer>
  );
};

export default Reportes;
