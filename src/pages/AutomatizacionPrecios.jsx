import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import automatizacionPreciosService from '../services/automatizacionPreciosService';

const PageContainer = styled.div`
  padding: 20px;
  background: #FFFFFF;
  min-height: 100vh;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
  border-bottom: 1px solid #E5E7EB;
  padding-bottom: 15px;

  h1 {
    font-size: 2.2rem;
    color: #722F37;
    margin-bottom: 5px;
  }

  p {
    font-size: 1.1rem;
    color: #6B7280;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  h3 {
    color: #722F37;
    margin-bottom: 20px;
    font-size: 1.5rem;
    border-bottom: 1px dashed #E5E7EB;
    padding-bottom: 10px;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: ${props => props.status === 'active' ? '#D1FAE5' : '#FEF3C7'};
  border: 1px solid ${props => props.status === 'active' ? '#10B981' : '#F59E0B'};
  border-radius: 8px;

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.status === 'active' ? '#10B981' : '#F59E0B'};
  }

  span {
    color: ${props => props.status === 'active' ? '#065F46' : '#92400E'};
    font-weight: 600;
  }
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const ControlCard = styled.div`
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 20px;
  text-align: center;

  h4 {
    color: #722F37;
    margin-bottom: 15px;
    font-size: 1.2rem;
  }

  p {
    color: #6B7280;
    margin-bottom: 15px;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' ? 'linear-gradient(135deg, #722F37 0%, #8B3A42 100%)' : 
                        props.variant === 'success' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' :
                        props.variant === 'danger' ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' :
                        'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: #722F37;
    box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #722F37;
`;

const Switch = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 15px;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #722F37;
  }

  span {
    color: #722F37;
    font-weight: 500;
  }
`;

const HistorialList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
`;

const HistorialItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #F3F4F6;
  background: ${props => props.isLatest ? '#F0F9FF' : 'white'};

  &:last-child {
    border-bottom: none;
  }

  .historial-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .fecha {
      font-weight: 600;
      color: #722F37;
    }

    .cambios-count {
      background: #722F37;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
    }
  }

  .historial-details {
    font-size: 0.9rem;
    color: #6B7280;
  }
`;

const SugerenciasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const SugerenciaCard = styled.div`
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 15px;
  text-align: center;

  .precio {
    font-size: 1.5rem;
    font-weight: bold;
    color: #722F37;
    margin-bottom: 5px;
  }

  .margen {
    font-size: 0.9rem;
    color: #6B7280;
    margin-bottom: 10px;
  }

  .descripcion {
    font-size: 0.8rem;
    color: #6B7280;
  }
`;

const AutomatizacionPrecios = () => {
  const [estado, setEstado] = useState({
    isRunning: false,
    isMonitoring: false,
    configuracion: {
      margenMinimo: 30,
      margenObjetivo: 50,
      actualizacionAutomatica: true,
      notificarCambios: true,
      intervaloVerificacion: 6
    },
    ultimaVerificacion: null
  });
  const [historial, setHistorial] = useState([]);
  const [sugerencias, setSugerencias] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Cargar estado inicial
  useEffect(() => {
    cargarEstado();
    cargarHistorial();
  }, []);

  const cargarEstado = () => {
    const estadoActual = automatizacionPreciosService.obtenerEstado();
    setEstado(estadoActual);
  };

  const cargarHistorial = () => {
    const historialActual = automatizacionPreciosService.obtenerHistorialCambios();
    setHistorial(historialActual);
  };

  const mostrarMensaje = (texto, tipo = 'info') => {
    setMessage(texto);
    setTimeout(() => setMessage(''), 3000);
  };

  const iniciarAutomatizacion = async () => {
    setIsLoading(true);
    try {
      const resultado = await automatizacionPreciosService.inicializar();
      if (resultado) {
        cargarEstado();
        mostrarMensaje('✅ Sistema de automatización iniciado', 'success');
      } else {
        mostrarMensaje('❌ Error iniciando automatización', 'error');
      }
    } catch (error) {
      mostrarMensaje('❌ Error iniciando automatización', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const detenerAutomatizacion = () => {
    try {
      automatizacionPreciosService.detenerMonitoreo();
      cargarEstado();
      mostrarMensaje('⏹️ Automatización detenida', 'info');
    } catch (error) {
      mostrarMensaje('❌ Error deteniendo automatización', 'error');
    }
  };

  const verificarCambios = async () => {
    setIsLoading(true);
    try {
      const cambios = await automatizacionPreciosService.verificarCambiosPendientes();
      cargarHistorial();
      cargarEstado();
      mostrarMensaje(`🔄 ${cambios.length} cambios verificados`, 'success');
    } catch (error) {
      mostrarMensaje('❌ Error verificando cambios', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarConfiguracion = (nuevaConfig) => {
    try {
      automatizacionPreciosService.actualizarConfiguracion(nuevaConfig);
      cargarEstado();
      mostrarMensaje('⚙️ Configuración actualizada', 'success');
    } catch (error) {
      mostrarMensaje('❌ Error actualizando configuración', 'error');
    }
  };

  const generarSugerencias = async () => {
    setIsLoading(true);
    try {
      // Simular obtención de sugerencias para una receta
      const sugerenciasEjemplo = {
        receta: { id: '1', nombre: 'Tarta de Pollo', costoTotal: 45.50 },
        precios: {
          margenMinimo: 59.15,
          margenObjetivo: 68.25,
          margenAlto: 77.35
        },
        analisis: {
          ventasTotales: 25,
          precioPromedioVenta: 65.00,
          margenActual: 42.8
        }
      };
      setSugerencias(sugerenciasEjemplo);
      mostrarMensaje('💡 Sugerencias generadas', 'success');
    } catch (error) {
      mostrarMensaje('❌ Error generando sugerencias', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatearFecha = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES');
  };

  return (
    <PageContainer>
      <Header>
        <h1>🤖 Automatización de Precios</h1>
        <p>Sistema inteligente para el cálculo automático de precios y costos.</p>
      </Header>

      <Content>
        {/* Estado del Sistema */}
        <Section>
          <h3>📊 Estado del Sistema</h3>
          
          <StatusIndicator status={estado.isMonitoring ? 'active' : 'inactive'}>
            <div className="status-dot"></div>
            <span>
              {estado.isMonitoring ? 'Automatización ACTIVA' : 'Automatización INACTIVA'}
            </span>
          </StatusIndicator>

          <ControlsGrid>
            <ControlCard>
              <h4>🚀 Control del Sistema</h4>
              <p>Inicia o detén el sistema de automatización</p>
              <div>
                <Button 
                  variant="success" 
                  onClick={iniciarAutomatizacion}
                  disabled={estado.isMonitoring || isLoading}
                >
                  {isLoading ? '⏳ Iniciando...' : '▶️ Iniciar'}
                </Button>
                <Button 
                  variant="danger" 
                  onClick={detenerAutomatizacion}
                  disabled={!estado.isMonitoring}
                >
                  ⏹️ Detener
                </Button>
              </div>
            </ControlCard>

            <ControlCard>
              <h4>🔄 Verificación Manual</h4>
              <p>Verifica cambios de precios inmediatamente</p>
              <Button 
                variant="primary" 
                onClick={verificarCambios}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Verificando...' : '🔍 Verificar Cambios'}
              </Button>
            </ControlCard>

            <ControlCard>
              <h4>💡 Sugerencias</h4>
              <p>Genera sugerencias de precios para recetas</p>
              <Button 
                variant="primary" 
                onClick={generarSugerencias}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Generando...' : '💡 Generar Sugerencias'}
              </Button>
            </ControlCard>
          </ControlsGrid>

          {message && (
            <div style={{ 
              padding: '15px', 
              background: message.includes('✅') ? '#D1FAE5' : message.includes('❌') ? '#FEE2E2' : '#FEF3C7',
              border: `1px solid ${message.includes('✅') ? '#10B981' : message.includes('❌') ? '#EF4444' : '#F59E0B'}`,
              borderRadius: '8px',
              marginBottom: '20px',
              color: message.includes('✅') ? '#065F46' : message.includes('❌') ? '#991B1B' : '#92400E'
            }}>
              {message}
            </div>
          )}
        </Section>

        {/* Configuración */}
        <Section>
          <h3>⚙️ Configuración del Sistema</h3>
          
          <ControlsGrid>
            <ControlCard>
              <h4>📈 Márgenes de Ganancia</h4>
              <Label>Margen Mínimo (%):</Label>
              <Input
                type="number"
                value={estado.configuracion.margenMinimo}
                onChange={(e) => actualizarConfiguracion({ margenMinimo: parseInt(e.target.value) || 30 })}
                min="0"
                max="100"
              />
              <Label>Margen Objetivo (%):</Label>
              <Input
                type="number"
                value={estado.configuracion.margenObjetivo}
                onChange={(e) => actualizarConfiguracion({ margenObjetivo: parseInt(e.target.value) || 50 })}
                min="0"
                max="100"
              />
            </ControlCard>

            <ControlCard>
              <h4>⏰ Frecuencia de Verificación</h4>
              <Label>Intervalo de verificación (horas):</Label>
              <Input
                type="number"
                value={estado.configuracion.intervaloVerificacion}
                onChange={(e) => actualizarConfiguracion({ intervaloVerificacion: parseInt(e.target.value) || 6 })}
                min="1"
                max="168"
              />
              <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '5px' }}>
                Recomendado: 6-12 horas para compras semanales
              </p>
            </ControlCard>

            <ControlCard>
              <h4>🔔 Notificaciones</h4>
              <Switch>
                <input
                  type="checkbox"
                  checked={estado.configuracion.actualizacionAutomatica}
                  onChange={(e) => actualizarConfiguracion({ actualizacionAutomatica: e.target.checked })}
                />
                <span>Actualización Automática</span>
              </Switch>
              <Switch>
                <input
                  type="checkbox"
                  checked={estado.configuracion.notificarCambios}
                  onChange={(e) => actualizarConfiguracion({ notificarCambios: e.target.checked })}
                />
                <span>Notificar Cambios</span>
              </Switch>
            </ControlCard>
          </ControlsGrid>
        </Section>

        {/* Sugerencias de Precios */}
        {sugerencias && (
          <Section>
            <h3>💡 Sugerencias de Precios</h3>
            <p><strong>Receta:</strong> {sugerencias.receta.nombre}</p>
            <p><strong>Costo Total:</strong> ${sugerencias.receta.costoTotal}</p>
            
            <SugerenciasGrid>
              <SugerenciaCard>
                <div className="precio">${sugerencias.precios.margenMinimo}</div>
                <div className="margen">{estado.configuracion.margenMinimo}% margen</div>
                <div className="descripcion">Precio mínimo recomendado</div>
              </SugerenciaCard>

              <SugerenciaCard>
                <div className="precio">${sugerencias.precios.margenObjetivo}</div>
                <div className="margen">{estado.configuracion.margenObjetivo}% margen</div>
                <div className="descripcion">Precio objetivo recomendado</div>
              </SugerenciaCard>

              <SugerenciaCard>
                <div className="precio">${sugerencias.precios.margenAlto}</div>
                <div className="margen">70% margen</div>
                <div className="descripcion">Precio premium</div>
              </SugerenciaCard>
            </SugerenciasGrid>

            <div style={{ marginTop: '20px', padding: '15px', background: '#F0F9FF', borderRadius: '8px' }}>
              <h4 style={{ color: '#722F37', marginBottom: '10px' }}>📊 Análisis de Ventas</h4>
              <p><strong>Ventas Totales:</strong> {sugerencias.analisis.ventasTotales}</p>
              <p><strong>Precio Promedio Actual:</strong> ${sugerencias.analisis.precioPromedioVenta}</p>
              <p><strong>Margen Actual:</strong> {sugerencias.analisis.margenActual.toFixed(1)}%</p>
            </div>
          </Section>
        )}

        {/* Historial de Cambios */}
        <Section>
          <h3>📋 Historial de Cambios</h3>
          
          {historial.length === 0 ? (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px' }}>
              No hay cambios registrados. El sistema comenzará a registrar cambios automáticamente.
            </p>
          ) : (
            <HistorialList>
              {historial.map((item, index) => (
                <HistorialItem key={index} isLatest={index === 0}>
                  <div className="historial-header">
                    <span className="fecha">{formatearFecha(item.timestamp)}</span>
                    <span className="cambios-count">{item.cambios.length} cambios</span>
                  </div>
                  <div className="historial-details">
                    {item.cambios.map((cambio, idx) => (
                      <div key={idx}>
                        • {cambio.insumoNombre}: {cambio.cambioPorcentual.toFixed(1)}% 
                        ({cambio.impacto.recetasAfectadas} recetas afectadas)
                      </div>
                    ))}
                  </div>
                </HistorialItem>
              ))}
            </HistorialList>
          )}
        </Section>

        {/* Información del Sistema */}
        <Section>
          <h3>ℹ️ Información del Sistema</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <strong>Estado:</strong> {estado.isMonitoring ? '🟢 Activo' : '🟡 Inactivo'}
            </div>
            <div>
              <strong>Última Verificación:</strong> {estado.ultimaVerificacion ? formatearFecha(estado.ultimaVerificacion) : 'Nunca'}
            </div>
            <div>
              <strong>Margen Mínimo:</strong> {estado.configuracion.margenMinimo}%
            </div>
            <div>
              <strong>Margen Objetivo:</strong> {estado.configuracion.margenObjetivo}%
            </div>
            <div>
              <strong>Actualización Automática:</strong> {estado.configuracion.actualizacionAutomatica ? '✅' : '❌'}
            </div>
            <div>
              <strong>Notificaciones:</strong> {estado.configuracion.notificarCambios ? '✅' : '❌'}
            </div>
            <div>
              <strong>Intervalo de Verificación:</strong> {estado.configuracion.intervaloVerificacion} horas
            </div>
          </div>
        </Section>
      </Content>
    </PageContainer>
  );
};

export default AutomatizacionPrecios;
