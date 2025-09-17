import React from 'react';
import styled from 'styled-components';

// Contenedor principal del formulario
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

// Grupo de campos del formulario
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  
  label {
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    
    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }
  
  input, select, textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #722F37;
      box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
    }
    
    &:disabled {
      background-color: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      padding: 0.625rem;
      font-size: 0.9rem;
    }
    
    @media (max-width: 480px) {
      padding: 0.5rem;
      font-size: 0.85rem;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
    
    @media (max-width: 768px) {
      min-height: 70px;
    }
  }
  
  small {
    color: #6b7280;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    line-height: 1.3;
    
    @media (max-width: 768px) {
      font-size: 0.7rem;
    }
  }
  
  .error {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
`;

// Fila de formulario para campos lado a lado
const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

// Fila de formulario para 3 columnas
const FormRowThree = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

// Fila de formulario para 4 columnas
const FormRowFour = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

// Acciones del formulario
const FormActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
  }
`;

// Botón del formulario
const FormButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
  }
  
  &.primary {
    background: #722F37;
    color: white;
    
    &:hover:not(:disabled) {
      background: #5a252a;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover:not(:disabled) {
      background: #e5e7eb;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: #f9fafb;
      color: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

// Campo de búsqueda
const SearchField = styled.div`
  position: relative;
  width: 100%;
  
  input {
    padding-left: 2.5rem;
  }
  
  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    font-size: 1rem;
  }
`;

// Selector de archivos
const FileInput = styled.div`
  position: relative;
  width: 100%;
  
  input[type="file"] {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  
  .file-label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    background: #f9fafb;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #722F37;
      background: #f3f4f6;
      color: #722F37;
    }
    
    @media (max-width: 768px) {
      padding: 0.625rem;
      font-size: 0.9rem;
    }
  }
`;

// Checkbox personalizado
const CheckboxField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: auto;
    margin: 0;
  }
  
  label {
    margin: 0;
    cursor: pointer;
    font-weight: 500;
  }
`;

// Radio group
const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.375rem;
  }
  
  .radio-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    
    input[type="radio"] {
      width: auto;
      margin: 0;
    }
    
    label {
      margin: 0;
      cursor: pointer;
      font-weight: 500;
    }
  }
`;

// Componentes exportados
export {
  FormContainer,
  FormGroup,
  FormRow,
  FormRowThree,
  FormRowFour,
  FormActions,
  FormButton,
  SearchField,
  FileInput,
  CheckboxField,
  RadioGroup
};

// Componente principal
const FormResponsive = ({ children, onSubmit, ...props }) => {
  return (
    <FormContainer onSubmit={onSubmit} {...props}>
      {children}
    </FormContainer>
  );
};

export default FormResponsive;
