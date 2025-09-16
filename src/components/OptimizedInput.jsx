import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useDebounce } from '../hooks/useDebounce';

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background: #FFFFFF;
  
  &:focus {
    outline: none;
    border-color: #722F37;
    box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
  }
  
  &:hover {
    border-color: #D1D5DB;
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
  
  &:disabled {
    background: #F9FAFB;
    color: #6B7280;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  color: #DC2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const LoadingIndicator = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid #E5E7EB;
  border-top: 2px solid #722F37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: translateY(-50%) rotate(0deg); }
    100% { transform: translateY(-50%) rotate(360deg); }
  }
`;

const OptimizedInput = ({
  label,
  value,
  onChange,
  onDebouncedChange,
  debounceDelay = 300,
  placeholder,
  type = 'text',
  error,
  disabled = false,
  required = false,
  className,
  ...props
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce del valor local
  const debouncedValue = useDebounce(localValue, debounceDelay);

  // Actualizar valor local cuando cambie el prop value
  React.useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || '');
    }
  }, [value]);

  // Manejar cambio inmediato
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Llamar onChange inmediatamente si está definido
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);

  // Manejar cambio con debounce
  React.useEffect(() => {
    if (onDebouncedChange && debouncedValue !== value) {
      setIsLoading(true);
      
      // Simular un pequeño delay para mostrar el indicador de carga
      const timer = setTimeout(() => {
        onDebouncedChange(debouncedValue);
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [debouncedValue, onDebouncedChange, value]);

  // Memoizar el input para evitar re-renders innecesarios
  const memoizedInput = useMemo(() => (
    <InputContainer className={className}>
      {label && <Label>{label}</Label>}
      <StyledInput
        type={type}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        {...props}
      />
      {isLoading && <LoadingIndicator />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  ), [localValue, handleChange, label, type, placeholder, disabled, required, error, className, isLoading, props]);

  return memoizedInput;
};

export default OptimizedInput;
