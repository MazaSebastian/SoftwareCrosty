import React from 'react';
import styled from 'styled-components';

// Grid Container Responsive
const GridContainer = styled.div`
  display: grid;
  gap: ${props => props.gap || '1rem'};
  grid-template-columns: ${props => {
    if (props.columns) {
      return props.columns;
    }
    // Auto-responsive por defecto
    return 'repeat(auto-fit, minmax(250px, 1fr))';
  }};
  
  /* Responsive breakpoints */
  @media (max-width: 1200px) {
    grid-template-columns: ${props => props.large || 'repeat(auto-fit, minmax(200px, 1fr))'};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: ${props => props.medium || '1fr'};
    gap: ${props => props.gapMobile || '0.75rem'};
  }
  
  @media (max-width: 480px) {
    grid-template-columns: ${props => props.small || '1fr'};
    gap: ${props => props.gapSmall || '0.5rem'};
  }
`;

// Grid para Dashboard Stats
const StatsGrid = styled(GridContainer)`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Grid para Cards de contenido
const CardsGrid = styled(GridContainer)`
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Grid para Formularios
const FormGrid = styled(GridContainer)`
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Grid para Listas/Tablas
const ListGrid = styled.div`
  display: grid;
  gap: 1rem;
  
  @media (min-width: 769px) {
    grid-template-columns: 2fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Container Responsive
const ResponsiveContainer = styled.div`
  width: 100%;
  max-width: ${props => props.maxWidth || '1400px'};
  margin: 0 auto;
  padding: ${props => props.padding || '2rem'};
  
  @media (max-width: 768px) {
    padding: ${props => props.paddingMobile || '1rem'};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.paddingSmall || '0.75rem'};
  }
`;

// Flex Container Responsive
const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  gap: ${props => props.gap || '1rem'};
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'flex-start'};
  flex-wrap: ${props => props.wrap || 'wrap'};
  
  @media (max-width: 768px) {
    flex-direction: ${props => props.directionMobile || 'column'};
    gap: ${props => props.gapMobile || '0.75rem'};
  }
`;

// Table Responsive
const TableContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  
  th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
  }
  
  tr:hover {
    background: #f9fafb;
  }
  
  @media (max-width: 768px) {
    th, td {
      padding: 0.5rem;
      font-size: 0.875rem;
    }
  }
`;

// Card Responsive
const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: ${props => props.padding || '1.5rem'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.paddingMobile || '1rem'};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.paddingSmall || '0.75rem'};
  }
`;

// Button Responsive
const ResponsiveButton = styled.button`
  padding: ${props => props.padding || '0.75rem 1.5rem'};
  font-size: ${props => props.fontSize || '1rem'};
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  min-height: 44px; /* Táctil friendly */
  
  @media (max-width: 768px) {
    padding: ${props => props.paddingMobile || '1rem 1.5rem'};
    font-size: ${props => props.fontSizeMobile || '1rem'};
    min-height: 48px; /* Más grande para móviles */
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.paddingSmall || '1rem'};
    font-size: ${props => props.fontSizeSmall || '0.875rem'};
    width: 100%;
  }
`;

// Input Responsive
const ResponsiveInput = styled.input`
  width: 100%;
  padding: ${props => props.padding || '0.75rem'};
  font-size: ${props => props.fontSize || '1rem'};
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-height: 44px; /* Táctil friendly */
  
  &:focus {
    outline: none;
    border-color: #722F37;
    box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.paddingMobile || '1rem'};
    font-size: ${props => props.fontSizeMobile || '1rem'};
    min-height: 48px;
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.paddingSmall || '0.875rem'};
    font-size: ${props => props.fontSizeSmall || '0.875rem'};
  }
`;

export {
  GridContainer,
  StatsGrid,
  CardsGrid,
  FormGrid,
  ListGrid,
  ResponsiveContainer,
  FlexContainer,
  TableContainer,
  Card,
  ResponsiveButton,
  ResponsiveInput
};
