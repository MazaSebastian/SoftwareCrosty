import React, { useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { useMemoizedData } from '../hooks/useMemoizedData';
import { ResponsiveContainer, StatsGrid, CardsGrid, Card } from '../components/GridResponsive';
// Funciones de fecha simples
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const DashboardContainer = styled(ResponsiveContainer)`
  background: #F5F5DC;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #722F37;
    margin: 0 0 0.5rem 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .subtitle {
    color: #6B7280;
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const StatsGridStyled = styled(StatsGrid)`
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  color: #333333;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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
    color: #6B7280;
  }
  
  .stat-subtitle {
    font-size: 0.85rem;
    color: #666666;
  }
  
  &.success {
    border-left: 4px solid #8B0000;
  }
  
  &.warning {
    border-left: 4px solid #FFD700;
  }
  
  &.danger {
    border-left: 4px solid #8B0000;
  }
  
  &.info {
    border-left: 4px solid #FFD700;
  }
`;

const QuickActions = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: #722F37;
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const ActionButton = styled.button`
  background: #722F37;
  border: 1px solid #E5E7EB;
  color: #F5F5DC;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #F5F5DC;
    color: #722F37;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(114, 47, 55, 0.3);
  }
`;

const RecentActivity = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: #722F37;
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #E5E7EB;
  
  &:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    font-size: 1.2rem;
    color: #722F37;
  }
  
  .activity-content {
    flex: 1;
    
    .activity-title {
      color: #6B7280;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .activity-time {
      color: #666666;
      font-size: 0.85rem;
    }
  }
  
  .activity-amount {
    color: white;
    font-weight: 600;
  }
`;

const Dashboard = () => {
  const { estadisticas, actualizarEstadisticas } = useApp();

  // Memoizar la función de actualización para evitar re-renders innecesarios
  const memoizedActualizarEstadisticas = useCallback(() => {
    return actualizarEstadisticas();
  }, [actualizarEstadisticas]);

  // Usar hook de datos memoizados para las estadísticas
  const { data: estadisticasMemoizadas, loading, refetch } = useMemoizedData(
    memoizedActualizarEstadisticas,
    [], // Sin dependencias adicionales
    {
      cacheTime: 2 * 60 * 1000, // 2 minutos de caché
      staleTime: 30 * 1000, // 30 segundos antes de considerar stale
      refetchOnMount: true
    }
  );

  // Usar estadísticas memoizadas o las del contexto
  const estadisticasFinales = estadisticasMemoizadas || estadisticas;

  // Memoizar funciones de formateo para evitar recreación en cada render
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  }, []);

  const formatDateTime = useCallback((date) => {
    return new Date(date).toLocaleString('es-AR');
  }, []);

  // Memoizar la fecha formateada
  const fechaFormateada = useMemo(() => {
    return formatDate(new Date());
  }, []);

  if (loading || !estadisticasFinales) {
    return (
      <DashboardContainer>
        <Header>
          <h1>Dashboard</h1>
          <div className="subtitle">Cargando estadísticas...</div>
        </Header>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <h1>Dashboard</h1>
        <div className="subtitle">
          Resumen del día - {fechaFormateada}
        </div>
      </Header>

      <StatsGridStyled>
        <StatCard className="success">
          <div className="stat-header">
            <div className="stat-title">Ventas Hoy</div>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-value">{formatCurrency(estadisticasFinales.ventasHoy.monto)}</div>
          <div className="stat-subtitle">
            {estadisticasFinales.ventasHoy.cantidad} ventas • 
            Efectivo: {formatCurrency(estadisticasFinales.ventasHoy.efectivo)} • 
            Transferencia: {formatCurrency(estadisticasFinales.ventasHoy.transferencia)}
          </div>
        </StatCard>

        <StatCard className="warning">
          <div className="stat-header">
            <div className="stat-title">Gastos Hoy</div>
            <div className="stat-icon">💸</div>
          </div>
          <div className="stat-value">{formatCurrency(estadisticasFinales.gastosHoy.monto)}</div>
          <div className="stat-subtitle">
            {estadisticasFinales.gastosHoy.cantidad} movimientos
          </div>
        </StatCard>

        <StatCard className="info">
          <div className="stat-header">
            <div className="stat-title">Saldo Caja</div>
            <div className="stat-icon">🏦</div>
          </div>
          <div className="stat-value">{formatCurrency(estadisticasFinales.saldoCaja.total)}</div>
          <div className="stat-subtitle">
            Efectivo: {formatCurrency(estadisticasFinales.saldoCaja.efectivo)} • 
            Transferencia: {formatCurrency(estadisticasFinales.saldoCaja.transferencia)}
          </div>
        </StatCard>

        <StatCard className={estadisticasFinales.stockBajo > 0 ? 'danger' : 'success'}>
          <div className="stat-header">
            <div className="stat-title">Stock Bajo</div>
            <div className="stat-icon">⚠️</div>
          </div>
          <div className="stat-value">{estadisticasFinales.stockBajo}</div>
          <div className="stat-subtitle">
            {estadisticasFinales.stockBajo > 0 ? 'Insumos con stock bajo' : 'Todo en orden'}
          </div>
        </StatCard>

        <StatCard className="info">
          <div className="stat-header">
            <div className="stat-title">Ventas Semana</div>
            <div className="stat-icon">📊</div>
          </div>
          <div className="stat-value">{formatCurrency(estadisticasFinales.ventasSemana.monto)}</div>
          <div className="stat-subtitle">
            {estadisticasFinales.ventasSemana.cantidad} ventas • 
            Promedio diario: {formatCurrency(estadisticasFinales.ventasSemana.promedioDiario)}
          </div>
        </StatCard>

        <StatCard className="success">
          <div className="stat-header">
            <div className="stat-title">Recetas Activas</div>
            <div className="stat-icon">🍽️</div>
          </div>
          <div className="stat-value">{estadisticasFinales.recetasActivas}</div>
          <div className="stat-subtitle">
            Recetas disponibles para producción
          </div>
        </StatCard>
      </StatsGridStyled>

      <QuickActions>
        <h3>Acciones Rápidas</h3>
        <ActionButton>➕ Nueva Venta</ActionButton>
        <ActionButton>💰 Registrar Gasto</ActionButton>
        <ActionButton>🥬 Agregar Insumo</ActionButton>
        <ActionButton>🍽️ Nueva Receta</ActionButton>
        <ActionButton>📊 Ver Reportes</ActionButton>
      </QuickActions>

      <RecentActivity>
        <h3>Actividad Reciente</h3>
        <ActivityItem>
          <div className="activity-icon">💰</div>
          <div className="activity-content">
            <div className="activity-title">Venta de Tarta de Pollo</div>
            <div className="activity-time">Hace 2 horas</div>
          </div>
          <div className="activity-amount">+$2,500</div>
        </ActivityItem>
        <ActivityItem>
          <div className="activity-icon">💸</div>
          <div className="activity-content">
            <div className="activity-title">Compra de Insumos</div>
            <div className="activity-time">Hace 4 horas</div>
          </div>
          <div className="activity-amount">-$1,500</div>
        </ActivityItem>
        <ActivityItem>
          <div className="activity-icon">🍽️</div>
          <div className="activity-content">
            <div className="activity-title">Producción de Pollo BBQ</div>
            <div className="activity-time">Hace 6 horas</div>
          </div>
          <div className="activity-amount">6 unidades</div>
        </ActivityItem>
      </RecentActivity>
    </DashboardContainer>
  );
};

export default Dashboard;
