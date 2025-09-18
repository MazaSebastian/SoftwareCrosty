import React from 'react';
import styled from 'styled-components';
import { formatCurrencyDetailed } from '../services/calculadoraCostos';

const DesgloseContainer = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const DesgloseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #722F37;
  
  h4 {
    color: #722F37;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .costo-total {
    color: #722F37;
    font-size: 1.2rem;
    font-weight: 700;
  }
`;

const IngredientesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const IngredienteItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  background: ${props => props.error ? '#FEE2E2' : '#F9FAFB'};
  border: 1px solid ${props => props.error ? '#FECACA' : '#E5E7EB'};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.error ? '#FEE2E2' : '#F3F4F6'};
    transform: translateY(-1px);
  }
  
  .ingrediente-nombre {
    font-weight: 600;
    color: #374151;
  }
  
  .cantidad {
    color: #6B7280;
    font-size: 0.9rem;
  }
  
  .precio-unitario {
    color: #6B7280;
    font-size: 0.9rem;
  }
  
  .costo-ingrediente {
    font-weight: 600;
    color: #722F37;
    text-align: right;
  }
  
  .error-message {
    grid-column: 1 / -1;
    color: #DC2626;
    font-size: 0.85rem;
    font-style: italic;
    margin-top: 0.25rem;
  }
`;

const ResumenContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E5E7EB;
  
  .resumen-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    
    .label {
      color: #6B7280;
      font-size: 0.9rem;
    }
    
    .value {
      font-weight: 600;
      color: #374151;
    }
    
    &.total {
      .label {
        color: #722F37;
        font-weight: 600;
        font-size: 1rem;
      }
      
      .value {
        color: #722F37;
        font-size: 1.1rem;
        font-weight: 700;
      }
    }
  }
`;

const DesgloseCostos = ({ 
  receta, 
  ingredientesConCosto = [], 
  costoTotal = 0,
  cantidadBase = 1,
  unidadBase = 'unidad'
}) => {
  if (!ingredientesConCosto || ingredientesConCosto.length === 0) {
    return (
      <DesgloseContainer>
        <DesgloseHeader>
          <h4>📊 Desglose de Costos</h4>
          <div className="costo-total">{formatCurrencyDetailed(costoTotal)}</div>
        </DesgloseHeader>
        <div style={{ textAlign: 'center', color: '#6B7280', padding: '1rem' }}>
          No hay ingredientes para mostrar
        </div>
      </DesgloseContainer>
    );
  }

  const costoPorUnidad = cantidadBase > 0 ? costoTotal / cantidadBase : 0;

  return (
    <DesgloseContainer>
      <DesgloseHeader>
        <h4>📊 Desglose de Costos - {receta?.nombre || 'Receta'}</h4>
        <div className="costo-total">{formatCurrencyDetailed(costoTotal)}</div>
      </DesgloseHeader>

      <IngredientesList>
        {ingredientesConCosto.map((ingrediente, index) => (
          <IngredienteItem key={index} error={!ingrediente.insumoEncontrado}>
            <div className="ingrediente-nombre">
              {ingrediente.nombre || ingrediente.insumoNombre || ingrediente.insumoNombre}
            </div>
            <div className="cantidad">
              {ingrediente.cantidadNecesaria || ingrediente.cantidad} {ingrediente.unidadNecesaria || ingrediente.unidad}
            </div>
            <div className="precio-unitario">
              {ingrediente.precioPorUnidadBase ? formatCurrencyDetailed(ingrediente.precioPorUnidadBase) : 'N/A'} / {ingrediente.unidadComprada || 'unidad'}
            </div>
            <div className="costo-ingrediente">
              {ingrediente.costo ? formatCurrencyDetailed(ingrediente.costo) : '$0.00'}
            </div>
            {!ingrediente.insumoEncontrado && (
              <div className="error-message">
                ⚠️ Insumo no encontrado en la base de datos
              </div>
            )}
            {ingrediente.error && (
              <div className="error-message">
                ⚠️ {ingrediente.error}
              </div>
            )}
          </IngredienteItem>
        ))}
      </IngredientesList>

      <ResumenContainer>
        <div className="resumen-item">
          <span className="label">Cantidad base:</span>
          <span className="value">{cantidadBase} {unidadBase}</span>
        </div>
        <div className="resumen-item">
          <span className="label">Costo por {unidadBase}:</span>
          <span className="value">{formatCurrencyDetailed(costoPorUnidad)}</span>
        </div>
        <div className="resumen-item total">
          <span className="label">Costo total:</span>
          <span className="value">{formatCurrencyDetailed(costoTotal)}</span>
        </div>
      </ResumenContainer>
    </DesgloseContainer>
  );
};

export default DesgloseCostos;
