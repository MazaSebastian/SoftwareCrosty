import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  border: 2px solid ${props => props.color || 'rgba(114, 47, 55, 0.2)'};
  border-top: 2px solid ${props => props.color || '#722F37'};
  border-radius: 50%;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  animation: ${spin} 1s linear infinite;
`;

const SpinnerText = styled.span`
  margin-left: ${props => props.size === 'small' ? '0.5rem' : '0.75rem'};
  font-size: ${props => props.size === 'small' ? '0.875rem' : '1rem'};
  color: ${props => props.color || '#722F37'};
`;

const ButtonSpinner = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
  
  &::after {
    content: '';
    width: 12px;
    height: 12px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

const LoadingSpinner = ({ 
  size = 'medium', 
  color, 
  text, 
  showText = false,
  className 
}) => {
  const sizeMap = {
    small: '16px',
    medium: '20px',
    large: '32px'
  };

  const spinnerSize = sizeMap[size] || size;

  if (showText && text) {
    return (
      <SpinnerContainer className={className}>
        <Spinner size={spinnerSize} color={color} />
        <SpinnerText size={size} color={color}>{text}</SpinnerText>
      </SpinnerContainer>
    );
  }

  return (
    <SpinnerContainer className={className}>
      <Spinner size={spinnerSize} color={color} />
    </SpinnerContainer>
  );
};

const LoadingButton = ({ children, loading, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading && <ButtonSpinner />}
      {children}
    </button>
  );
};

export { LoadingSpinner, LoadingButton, ButtonSpinner };
export default LoadingSpinner;