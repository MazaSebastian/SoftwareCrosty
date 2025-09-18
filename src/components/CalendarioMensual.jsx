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

const NavegacionMes = styled.div`
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

const MesActual = styled.div`
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

const GridMensual = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const DiaContainer = styled.div`
  background: ${props => {
    if (props.esHoy) return '#FEF3C7';
    if (props.esOtroMes) return '#F9FAFB';
    return '#FFFFFF';
  }};
  border: 1px solid ${props => {
    if (props.esHoy) return '#F59E0B';
    if (props.esOtroMes) return '#E5E7EB';
    return '#E5E7EB';
  }};
  border-radius: 8px;
  min-height: 100px;
  padding: 0.5rem;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #722F37;
    box-shadow: 0 2px 8px rgba(114, 47, 55, 0.1);
  }
  
  @media (max-width: 768px) {
    min-height: 80px;
    padding: 0.25rem;
  }
`;

const NumeroDia = styled.div`
  font-weight: 700;
  color: ${props => {
    if (props.esHoy) return '#D97706';
    if (props.esOtroMes) return '#9CA3AF';
    return '#374151';
  }};
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const TareasContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
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
  border-radius: 3px;
  padding: 0.125rem 0.25rem;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .titulo {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.0625rem;
  }
  
  .hora {
    color: #6B7280;
    font-size: 0.6rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.1rem 0.2rem;
    font-size: 0.6rem;
  }
`;

const IndicadorMas = styled.div`
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
  background: #722F37;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #5a252a;
  }
  
  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
    font-size: 0.6rem;
  }
`;

const CalendarioMensual = ({ 
  planificaciones = [], 
  onTareaClick, 
  onDiaClick,
  fechaInicio = null 
}) => {
  const [mesActual, setMesActual] = useState(new Date());
  const [diasMes, setDiasMes] = useState([]);

  // Calcular días del mes
  useEffect(() => {
    const calcularDiasMes = (fecha) => {
      const dias = [];
      const año = fecha.getFullYear();
      const mes = fecha.getMonth();
      
      // Primer día del mes
      const primerDia = new Date(año, mes, 1);
      // Último día del mes
      const ultimoDia = new Date(año, mes + 1, 0);
      
      // Días del mes anterior para completar la primera semana
      const diaSemanaPrimerDia = primerDia.getDay();
      for (let i = diaSemanaPrimerDia - 1; i >= 0; i--) {
        const dia = new Date(primerDia);
        dia.setDate(primerDia.getDate() - (i + 1));
        dias.push({ fecha: dia, esOtroMes: true });
      }
      
      // Días del mes actual
      for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const fechaDia = new Date(año, mes, dia);
        dias.push({ fecha: fechaDia, esOtroMes: false });
      }
      
      // Días del mes siguiente para completar la última semana
      const diasRestantes = 42 - dias.length; // 6 semanas * 7 días
      for (let i = 1; i <= diasRestantes; i++) {
        const dia = new Date(ultimoDia);
        dia.setDate(ultimoDia.getDate() + i);
        dias.push({ fecha: dia, esOtroMes: true });
      }
      
      return dias;
    };

    if (fechaInicio) {
      setMesActual(new Date(fechaInicio));
    }
    
    setDiasMes(calcularDiasMes(mesActual));
  }, [mesActual, fechaInicio]);

  // Navegar al mes anterior
  const mesAnterior = () => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(mesActual.getMonth() - 1);
    setMesActual(nuevoMes);
  };

  // Navegar al mes siguiente
  const mesSiguiente = () => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(mesActual.getMonth() + 1);
    setMesActual(nuevoMes);
  };

  // Ir al mes actual
  const irAHoy = () => {
    setMesActual(new Date());
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

  // Obtener nombre del mes y año
  const obtenerNombreMes = () => {
    return mesActual.toLocaleDateString('es-AR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Nombres de los días de la semana
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <CalendarioContainer>
      <CalendarioHeader>
        <h3>📅 Planificación Mensual</h3>
        <NavegacionMes>
          <BotonNavegacion onClick={mesAnterior}>
            ← Anterior
          </BotonNavegacion>
          <MesActual>
            {obtenerNombreMes()}
          </MesActual>
          <BotonNavegacion onClick={mesSiguiente}>
            Siguiente →
          </BotonNavegacion>
          <BotonNavegacion onClick={irAHoy}>
            Hoy
          </BotonNavegacion>
        </NavegacionMes>
      </CalendarioHeader>

      <DiasSemana>
        {nombresDias.map((dia, index) => (
          <DiaHeader key={index}>
            {dia}
          </DiaHeader>
        ))}
      </DiasSemana>

      <GridMensual>
        {diasMes.map((dia, index) => {
          const tareasDelDia = obtenerTareasDelDia(dia.fecha);
          const tareasVisibles = tareasDelDia.slice(0, 2); // Solo 2 tareas visibles en vista mensual
          const tareasOcultas = tareasDelDia.length - 2;

          return (
            <DiaContainer 
              key={index} 
              esHoy={esHoy(dia.fecha)}
              esOtroMes={dia.esOtroMes}
              onClick={() => onDiaClick && onDiaClick(dia.fecha)}
            >
              <NumeroDia esHoy={esHoy(dia.fecha)} esOtroMes={dia.esOtroMes}>
                {dia.fecha.getDate()}
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
                    onDiaClick && onDiaClick(dia.fecha);
                  }}
                >
                  +{tareasOcultas}
                </IndicadorMas>
              )}
            </DiaContainer>
          );
        })}
      </GridMensual>
    </CalendarioContainer>
  );
};

export default CalendarioMensual;
