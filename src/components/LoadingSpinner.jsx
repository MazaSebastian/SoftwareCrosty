import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animación de rotación
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Animación de pulso
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.height || '400px'};
  flex-direction: column;
  color: #722F37;
  background: ${props => props.background || 'transparent'};
  border-radius: ${props => props.borderRadius || '0'};
  padding: ${props => props.padding || '0'};
`;

const Spinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 4px solid #E5E7EB;
  border-top: 4px solid #722F37;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: ${props => props.text ? '20px' : '0'};
`;

const LoadingText = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #722F37;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 10px;
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: #722F37;
    border-radius: 50%;
    animation: ${pulse} 1.4s ease-in-out infinite both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;

// Componente principal de loading
const LoadingSpinner = ({ 
  text = 'Cargando...', 
  size = '40px', 
  height = '400px',
  showDots = false,
  background = 'transparent',
  borderRadius = '0',
  padding = '0'
}) => {
  return (
    <SpinnerContainer 
      height={height}
      background={background}
      borderRadius={borderRadius}
      padding={padding}
    >
      <Spinner size={size} text={text} />
      {text && <LoadingText>{text}</LoadingText>}
      {showDots && (
        <LoadingDots>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </LoadingDots>
      )}
    </SpinnerContainer>
  );
};

// Componente de loading para páginas completas
export const PageLoading = ({ text = 'Cargando página...' }) => (
  <LoadingSpinner 
    text={text}
    size="50px"
    height="100vh"
    background="#F5F5DC"
    showDots={true}
  />
);

// Componente de loading para secciones
export const SectionLoading = ({ text = 'Cargando...' }) => (
  <LoadingSpinner 
    text={text}
    size="30px"
    height="200px"
    background="#FFFFFF"
    borderRadius="12px"
    padding="2rem"
    showDots={true}
  />
);

// Componente de loading para botones
export const ButtonLoading = ({ size = '20px' }) => (
  <Spinner size={size} />
);

// Componente de loading para gráficos
export const ChartLoading = ({ text = 'Cargando gráfico...' }) => (
  <LoadingSpinner 
    text={text}
    size="35px"
    height="300px"
    background="#FFFFFF"
    borderRadius="8px"
    padding="1rem"
  />
);

export default LoadingSpinner;
