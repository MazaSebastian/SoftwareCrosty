import React from 'react';
import styled, { keyframes } from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-out;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
  animation: ${slideIn} 0.3s ease-out;
`;

const LoadingText = styled.p`
  margin: 0;
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #722F37;
  border-radius: 2px;
  width: ${props => props.progress || 0}%;
  transition: width 0.3s ease;
`;

const LoadingOverlay = ({ 
  isVisible, 
  message = 'Cargando...', 
  progress,
  showProgress = false 
}) => {
  if (!isVisible) return null;

  return (
    <Overlay>
      <LoadingCard>
        <LoadingSpinner size="large" />
        <LoadingText>{message}</LoadingText>
        {showProgress && (
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
        )}
      </LoadingCard>
    </Overlay>
  );
};

const InlineLoading = ({ message = 'Cargando...', size = 'medium' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '1rem',
      padding: '2rem'
    }}>
      <LoadingSpinner size={size} />
      <LoadingText>{message}</LoadingText>
    </div>
  );
};

export { LoadingOverlay, InlineLoading };
export default LoadingOverlay;
