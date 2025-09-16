import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartContainer = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  h3 {
    color: #722F37;
    margin-bottom: 20px;
    font-size: 1.3rem;
    text-align: center;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

// Configuración por defecto para los gráficos
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#722F37',
        font: {
          size: 12
        }
      }
    },
    title: {
      display: true,
      color: '#722F37',
      font: {
        size: 16,
        weight: 'bold'
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: '#F3F4F6'
      },
      ticks: {
        color: '#6B7280'
      }
    },
    y: {
      grid: {
        color: '#F3F4F6'
      },
      ticks: {
        color: '#6B7280'
      }
    }
  }
};

// Colores del tema CROSTY
const colors = {
  primary: '#722F37',
  secondary: '#8B3A42',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  light: '#F5F5DC',
  dark: '#6B7280'
};

// Componente de gráfico de líneas
export const LineChart = ({ title, data, options = {} }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: data.datasets || []
  };

  const chartOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins,
      title: {
        ...defaultOptions.plugins.title,
        text: title,
        ...options.plugins?.title
      }
    }
  };

  return (
    <ChartContainer>
      <h3>{title}</h3>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </ChartContainer>
  );
};

// Componente de gráfico de barras
export const BarChart = ({ title, data, options = {} }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: data.datasets || []
  };

  const chartOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins,
      title: {
        ...defaultOptions.plugins.title,
        text: title,
        ...options.plugins?.title
      }
    }
  };

  return (
    <ChartContainer>
      <h3>{title}</h3>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </ChartContainer>
  );
};

// Componente de gráfico circular
export const DoughnutChart = ({ title, data, options = {} }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: data.datasets || []
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#722F37',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: title,
        color: '#722F37',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  return (
    <ChartContainer>
      <h3>{title}</h3>
      <div style={{ height: '300px' }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </ChartContainer>
  );
};

// Componente de métricas
export const MetricCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .metric-value {
    font-size: 2rem;
    font-weight: bold;
    color: ${props => props.color || '#722F37'};
    margin-bottom: 5px;
  }

  .metric-label {
    color: #6B7280;
    font-size: 0.9rem;
    margin-bottom: 10px;
  }

  .metric-change {
    font-size: 0.8rem;
    color: ${props => props.changeColor || '#6B7280'};
  }
`;

// Grid de métricas
export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

// Exportar ChartsGrid individualmente
export { ChartsGrid };

// Exportar colores para uso en otros componentes
export { colors };

// Componente principal de gráficos
export const Charts = {
  LineChart,
  BarChart,
  DoughnutChart,
  MetricCard,
  MetricsGrid,
  ChartsGrid,
  colors
};

export default Charts;
