import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CalendarioContainer = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const CalendarioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    color: #722F37;
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const NavegacionSemana = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BotonNavegacion = styled.button`
  background: #722F37;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: #5a252a;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const SemanaActual = styled.div`
  color: #374151;
  font-weight: 600;
  font-size: 1rem;
  min-width: 200px;
  text-align: center;
`;

const DiasSemana = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const DiaHeader = styled.div`
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }
`;

const DiaContainer = styled.div`
  background: ${props => props.esHoy ? '#FEF3C7' : '#FFFFFF'};
  border: 1px solid ${props => props.esHoy ? '#F59E0B' : '#E5E7EB'};
  border-radius: 8px;
  min-height: 120px;
  padding: 0.75rem;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #722F37;
    box-shadow: 0 2px 8px rgba(114, 47, 55, 0.1);
  }
  
  @media (max-width: 768px) {
    min-height: 100px;
    padding: 0.5rem;
  }
`;

const NumeroDia = styled.div`
  font-weight: 700;
  color: ${props => props.esHoy ? '#D97706' : '#374151'};
  font-size: 1rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const TareasContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TareaItem = styled.div`
  background: ${props => {
    switch (props.prioridad) {
      case 'urgente': return '#FEE2E2';
      case 'alta': return '#FEF3C7';
      case 'media': return '#DBEAFE';
      case 'baja': return '#F3F4F6';
      default: return '#F3F4F6';
    }
  }};
  border: 1px solid ${props => {
    switch (props.prioridad) {
      case 'urgente': return '#FECACA';
      case 'alta': return '#FDE68A';
      case 'media': return '#BFDBFE';
      case 'baja': return '#E5E7EB';
      default: return '#E5E7EB';
    }
  }};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .titulo {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.125rem;
  }
  
  .hora {
    color: #6B7280;
    font-size: 0.7rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.2rem 0.4rem;
    font-size: 0.7rem;
  }
`;

const IndicadorMas = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: #722F37;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #5a252a;
  }
  
  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
  }
`;

const CalendarioSemanal = ({ 
  planificaciones = [], 
  onTareaClick, 
  onDiaClick,
  fechaInicio = null 
}) => {
  const [semanaActual, setSemanaActual] = useState(new Date());
  const [diasSemana, setDiasSemana] = useState([]);

  // Calcular días de la semana
  useEffect(() => {
    const calcularDiasSemana = (fecha) => {
      const dias = [];
      const inicioSemana = new Date(fecha);
      inicioSemana.setDate(fecha.getDate() - fecha.getDay()); // Domingo
      
      for (let i = 0; i < 7; i++) {
        const dia = new Date(inicioSemana);
        dia.setDate(inicioSemana.getDate() + i);
        dias.push(dia);
      }
      
      return dias;
    };

    if (fechaInicio) {
      setSemanaActual(new Date(fechaInicio));
    }
    
    setDiasSemana(calcularDiasSemana(semanaActual));
  }, [semanaActual, fechaInicio]);

  // Navegar a la semana anterior
  const semanaAnterior = () => {
    const nuevaSemana = new Date(semanaActual);
    nuevaSemana.setDate(semanaActual.getDate() - 7);
    setSemanaActual(nuevaSemana);
  };

  // Navegar a la semana siguiente
  const semanaSiguiente = () => {
    const nuevaSemana = new Date(semanaActual);
    nuevaSemana.setDate(semanaActual.getDate() + 7);
    setSemanaActual(nuevaSemana);
  };

  // Ir a la semana actual
  const irAHoy = () => {
    setSemanaActual(new Date());
  };

  // Obtener tareas para un día específico
  const obtenerTareasDelDia = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return planificaciones.filter(planificacion => {
      const planificacionFecha = new Date(planificacion.fecha).toISOString().split('T')[0];
      return planificacionFecha === fechaStr;
    });
  };

  // Verificar si es hoy
  const esHoy = (fecha) => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Obtener nombre del día
  const obtenerNombreDia = (fecha) => {
    return fecha.toLocaleDateString('es-AR', { weekday: 'short' });
  };

  // Obtener rango de la semana
  const obtenerRangoSemana = () => {
    const inicio = diasSemana[0];
    const fin = diasSemana[6];
    
    if (!inicio || !fin) return '';
    
    const inicioStr = inicio.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
    const finStr = fin.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
    
    return `${inicioStr} - ${finStr}`;
  };

  return (
    <CalendarioContainer>
      <CalendarioHeader>
        <h3>📅 Planificación Semanal</h3>
        <NavegacionSemana>
          <BotonNavegacion onClick={semanaAnterior}>
            ← Anterior
          </BotonNavegacion>
          <SemanaActual>
            {obtenerRangoSemana()}
          </SemanaActual>
          <BotonNavegacion onClick={semanaSiguiente}>
            Siguiente →
          </BotonNavegacion>
          <BotonNavegacion onClick={irAHoy}>
            Hoy
          </BotonNavegacion>
        </NavegacionSemana>
      </CalendarioHeader>

      <DiasSemana>
        {diasSemana.map((dia, index) => (
          <DiaHeader key={index}>
            {obtenerNombreDia(dia)}
          </DiaHeader>
        ))}
      </DiasSemana>

      <DiasSemana>
        {diasSemana.map((dia, index) => {
          const tareasDelDia = obtenerTareasDelDia(dia);
          const tareasVisibles = tareasDelDia.slice(0, 3);
          const tareasOcultas = tareasDelDia.length - 3;

          return (
            <DiaContainer 
              key={index} 
              esHoy={esHoy(dia)}
              onClick={() => onDiaClick && onDiaClick(dia)}
            >
              <NumeroDia esHoy={esHoy(dia)}>
                {dia.getDate()}
              </NumeroDia>
              
              <TareasContainer>
                {tareasVisibles.map((tarea, tareaIndex) => (
                  <TareaItem
                    key={tareaIndex}
                    prioridad={tarea.prioridad}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTareaClick && onTareaClick(tarea);
                    }}
                  >
                    <div className="titulo">{tarea.nombre}</div>
                    {tarea.hora_inicio && (
                      <div className="hora">{tarea.hora_inicio}</div>
                    )}
                  </TareaItem>
                ))}
              </TareasContainer>
              
              {tareasOcultas > 0 && (
                <IndicadorMas
                  onClick={(e) => {
                    e.stopPropagation();
                    onDiaClick && onDiaClick(dia);
                  }}
                >
                  +{tareasOcultas}
                </IndicadorMas>
              )}
            </DiaContainer>
          );
        })}
      </DiasSemana>
    </CalendarioContainer>
  );
};

export default CalendarioSemanal;
