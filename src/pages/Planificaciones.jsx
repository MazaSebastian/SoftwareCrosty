import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  obtenerPlanificaciones, 
  crearPlanificacion, 
  actualizarPlanificacion, 
  eliminarPlanificacion,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  obtenerPlanificacionesSemanaActual,
  obtenerEstadisticasPlanificaciones,
  obtenerTemplates,
  aplicarTemplate,
  TIPOS_PLANIFICACION,
  ESTADOS_TAREA,
  PRIORIDADES
} from '../services/planificacionesService';
import { ResponsiveContainer, StatsGrid, CardsGrid } from '../components/GridResponsive';
import { 
  FormContainer, 
  FormGroup, 
  FormRow, 
  FormActions, 
  FormButton 
} from '../components/FormResponsive';
import { SkeletonList } from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';
import CalendarioSemanal from '../components/CalendarioSemanal';
import { usePlanificacionesRealtime } from '../services/planificacionesRealtimeService';
import SyncIndicator from '../components/SyncIndicator';

const PageContainer = styled(ResponsiveContainer)`
  background: #FFFFFF;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #722F37;
  
  h1 {
    color: #722F37;
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }
  
  .subtitle {
    color: #6B7280;
    font-size: 1rem;
    margin-top: 0.25rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const Button = styled.button`
  background: #722F37;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #5a252a;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
`;

const StatsGridStyled = styled(StatsGrid)`
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  color: #333333;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 0;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 100px;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    min-height: 90px;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #722F37;
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    
    .stat-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #722F37;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .stat-icon {
      font-size: 1.5rem;
      color: #722F37;
    }
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #6B7280;
    word-break: break-word;
    overflow-wrap: break-word;
    line-height: 1.2;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
  }
  
  .stat-subtitle {
    font-size: 0.85rem;
    color: #666666;
  }
  
  &.success {
    border-left: 4px solid #10B981;
  }
  
  &.warning {
    border-left: 4px solid #F59E0B;
  }
  
  &.error {
    border-left: 4px solid #EF4444;
  }
  
  &.info {
    border-left: 4px solid #3B82F6;
  }
`;

const ContentGrid = styled(CardsGrid)`
  margin-bottom: 2rem;
`;

const Section = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  
  h3 {
    color: #722F37;
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  
  h2 {
    margin: 0 0 1.5rem 0;
    color: #1e293b;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 95%;
  }
`;

const TareasList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  .tarea-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #E5E7EB;
    
    &:last-child {
      border-bottom: none;
    }
    
    .tarea-info {
      flex: 1;
      
      .titulo {
        color: #722F37;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .detalles {
        color: #6B7280;
        font-size: 0.85rem;
      }
    }
    
    .tarea-actions {
      margin-left: 1rem;
      display: flex;
      gap: 0.5rem;
      
      button {
        background: none;
        border: none;
        color: #6B7280;
        cursor: pointer;
        padding: 0.25rem;
        
        &:hover {
          color: #722F37;
        }
      }
    }
  }
`;

const Planificaciones = () => {
  const [planificaciones, setPlanificaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTareaModalOpen, setIsTareaModalOpen] = useState(false);
  const [selectedPlanificacion, setSelectedPlanificacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { showSuccess, showError, showInfo } = useToast();

  // Hook de sincronización en tiempo real (opcional)
  let planificacionesRealtime = [];
  let tareasRealtime = [];
  let connectionStatus = { isConnected: false, reconnectAttempts: 0 };
  let addListener = () => () => {};
  
  try {
    const realtimeHook = usePlanificacionesRealtime();
    planificacionesRealtime = realtimeHook.planificaciones || [];
    tareasRealtime = realtimeHook.tareas || [];
    connectionStatus = realtimeHook.connectionStatus || { isConnected: false, reconnectAttempts: 0 };
    addListener = realtimeHook.addListener || (() => () => {});
  } catch (error) {
    console.warn('Error cargando hook de sincronización:', error);
    // Continuar sin sincronización en tiempo real
  }
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: TIPOS_PLANIFICACION.PRODUCCION,
    prioridad: PRIORIDADES.MEDIA
  });
  
  const [tareaData, setTareaData] = useState({
    titulo: '',
    descripcion: '',
    tipo: TIPOS_PLANIFICACION.PRODUCCION,
    prioridad: PRIORIDADES.MEDIA,
    hora_inicio: '',
    hora_fin: '',
    duracion_estimada: '',
    observaciones: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  // Configurar listeners de sincronización en tiempo real
  useEffect(() => {
    const removeListeners = [];

    // Listener para nuevas planificaciones
    const removeNuevaPlanificacion = addListener('nueva_planificacion', (nuevaPlanificacion) => {
      console.log('🆕 Nueva planificación recibida:', nuevaPlanificacion);
      setPlanificaciones(prev => [nuevaPlanificacion, ...prev]);
      setNotificationCount(prev => prev + 1);
      showInfo(`Nueva planificación: ${nuevaPlanificacion.nombre}`);
    });
    removeListeners.push(removeNuevaPlanificacion);

    // Listener para planificaciones actualizadas
    const removePlanificacionActualizada = addListener('planificacion_actualizada', ({ nueva, anterior }) => {
      console.log('🔄 Planificación actualizada:', { nueva, anterior });
      setPlanificaciones(prev => prev.map(p => p.id === nueva.id ? nueva : p));
      setNotificationCount(prev => prev + 1);
      showInfo(`Planificación actualizada: ${nueva.nombre}`);
    });
    removeListeners.push(removePlanificacionActualizada);

    // Listener para planificaciones eliminadas
    const removePlanificacionEliminada = addListener('planificacion_eliminada', (planificacionEliminada) => {
      console.log('🗑️ Planificación eliminada:', planificacionEliminada);
      setPlanificaciones(prev => prev.filter(p => p.id !== planificacionEliminada.id));
      setNotificationCount(prev => prev + 1);
      showInfo(`Planificación eliminada: ${planificacionEliminada.nombre}`);
    });
    removeListeners.push(removePlanificacionEliminada);

    // Listener para nuevas tareas
    const removeNuevaTarea = addListener('nueva_tarea', (nuevaTarea) => {
      console.log('🆕 Nueva tarea recibida:', nuevaTarea);
      setPlanificaciones(prev => prev.map(p => 
        p.id === nuevaTarea.planificacionId 
          ? { ...p, tareas: [...(p.tareas || []), nuevaTarea] }
          : p
      ));
      setNotificationCount(prev => prev + 1);
      showInfo(`Nueva tarea: ${nuevaTarea.titulo}`);
    });
    removeListeners.push(removeNuevaTarea);

    // Listener para tareas actualizadas
    const removeTareaActualizada = addListener('tarea_actualizada', ({ nueva, anterior }) => {
      console.log('🔄 Tarea actualizada:', { nueva, anterior });
      setPlanificaciones(prev => prev.map(p => 
        p.id === nueva.planificacionId 
          ? { 
              ...p, 
              tareas: (p.tareas || []).map(t => t.id === nueva.id ? nueva : t)
            }
          : p
      ));
      setNotificationCount(prev => prev + 1);
      showInfo(`Tarea actualizada: ${nueva.titulo}`);
    });
    removeListeners.push(removeTareaActualizada);

    // Listener para tareas eliminadas
    const removeTareaEliminada = addListener('tarea_eliminada', (tareaEliminada) => {
      console.log('🗑️ Tarea eliminada:', tareaEliminada);
      setPlanificaciones(prev => prev.map(p => 
        p.id === tareaEliminada.planificacionId 
          ? { 
              ...p, 
              tareas: (p.tareas || []).filter(t => t.id !== tareaEliminada.id)
            }
          : p
      ));
      setNotificationCount(prev => prev + 1);
      showInfo(`Tarea eliminada: ${tareaEliminada.titulo}`);
    });
    removeListeners.push(removeTareaEliminada);

    // Listener para cambios de conexión
    const removeConnectionChange = addListener('connection', (status) => {
      console.log('📡 Estado de conexión:', status);
      if (status.status === 'connected') {
        showInfo('Sincronización en tiempo real activada');
      } else if (status.status === 'disconnected') {
        showError('Sincronización en tiempo real desconectada');
      }
    });
    removeListeners.push(removeConnectionChange);

    // Cleanup
    return () => {
      removeListeners.forEach(remove => remove());
    };
  }, [addListener, showInfo, showError]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [planificacionesData, estadisticasData, templatesData] = await Promise.all([
        obtenerPlanificacionesSemanaActual(),
        obtenerEstadisticasPlanificaciones(),
        obtenerTemplates()
      ]);
      
      setPlanificaciones(planificacionesData);
      setEstadisticas(estadisticasData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showError('Error al cargar las planificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.fecha) return;

    try {
      setSaving(true);
      const nuevaPlanificacion = await crearPlanificacion(formData);
      
      setPlanificaciones(prev => [nuevaPlanificacion, ...prev]);
      setIsModalOpen(false);
      setFormData({
        nombre: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        tipo: TIPOS_PLANIFICACION.PRODUCCION,
        prioridad: PRIORIDADES.MEDIA
      });
      showSuccess('Planificación creada exitosamente');
      await cargarDatos(); // Recargar estadísticas
    } catch (error) {
      console.error('Error al crear planificación:', error);
      showError('Error al crear la planificación');
    } finally {
      setSaving(false);
    }
  };

  const handleTareaSubmit = async (e) => {
    e.preventDefault();
    if (!tareaData.titulo || !selectedPlanificacion) return;

    try {
      setSaving(true);
      const nuevaTarea = await crearTarea({
        ...tareaData,
        planificacion_id: selectedPlanificacion.id
      });
      
      // Actualizar la planificación local
      setPlanificaciones(prev => prev.map(p => 
        p.id === selectedPlanificacion.id 
          ? { ...p, tareas: [...(p.tareas || []), nuevaTarea] }
          : p
      ));
      
      setIsTareaModalOpen(false);
      setTareaData({
        titulo: '',
        descripcion: '',
        tipo: TIPOS_PLANIFICACION.PRODUCCION,
        prioridad: PRIORIDADES.MEDIA,
        hora_inicio: '',
        hora_fin: '',
        duracion_estimada: '',
        observaciones: ''
      });
      showSuccess('Tarea creada exitosamente');
    } catch (error) {
      console.error('Error al crear tarea:', error);
      showError('Error al crear la tarea');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta planificación?')) {
      try {
        await eliminarPlanificacion(id);
        setPlanificaciones(prev => prev.filter(p => p.id !== id));
        showSuccess('Planificación eliminada exitosamente');
        await cargarDatos(); // Recargar estadísticas
      } catch (error) {
        console.error('Error al eliminar planificación:', error);
        showError('Error al eliminar la planificación');
      }
    }
  };

  const handleTareaClick = (tarea) => {
    console.log('Tarea clickeada:', tarea);
    // Aquí podrías abrir un modal para editar la tarea
  };

  const handleDiaClick = (dia) => {
    console.log('Día clickeado:', dia);
    // Aquí podrías abrir un modal para crear una nueva planificación en ese día
    setFormData(prev => ({
      ...prev,
      fecha: dia.toISOString().split('T')[0]
    }));
    setIsModalOpen(true);
  };

  const handleNuevaTarea = (planificacion) => {
    setSelectedPlanificacion(planificacion);
    setIsTareaModalOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      [TIPOS_PLANIFICACION.PRODUCCION]: 'Producción',
      [TIPOS_PLANIFICACION.PRE_PRODUCCION]: 'Pre-producción',
      [TIPOS_PLANIFICACION.CORTADO_VERDURAS]: 'Cortado de Verduras',
      [TIPOS_PLANIFICACION.RECIBO_PEDIDOS]: 'Recibo de Pedidos',
      [TIPOS_PLANIFICACION.LIMPIEZA]: 'Limpieza',
      [TIPOS_PLANIFICACION.INVENTARIO]: 'Inventario',
      [TIPOS_PLANIFICACION.MANTENIMIENTO]: 'Mantenimiento'
    };
    return labels[tipo] || tipo;
  };

  const getPrioridadColor = (prioridad) => {
    const colors = {
      [PRIORIDADES.URGENTE]: '#EF4444',
      [PRIORIDADES.ALTA]: '#F59E0B',
      [PRIORIDADES.MEDIA]: '#3B82F6',
      [PRIORIDADES.BAJA]: '#10B981'
    };
    return colors[prioridad] || '#6B7280';
  };

  return (
    <PageContainer>
      <Header>
        <div>
          <h1>Planificaciones</h1>
          <div className="subtitle">Gestión de tareas y planificación semanal</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <SyncIndicator 
            isConnected={connectionStatus.isConnected}
            notificationCount={notificationCount}
            onNotificationClick={() => setNotificationCount(0)}
          />
          <Button onClick={() => setIsModalOpen(true)}>
            ➕ Nueva Planificación
          </Button>
        </div>
      </Header>

      {loading ? (
        <SkeletonList count={4} />
      ) : (
        <>
          <StatsGridStyled>
            <StatCard className="info">
              <div className="stat-header">
                <div className="stat-title">Total Planificaciones</div>
                <div className="stat-icon">📅</div>
              </div>
              <div className="stat-value">{estadisticas?.total || 0}</div>
              <div className="stat-subtitle">
                Planificaciones registradas
              </div>
            </StatCard>

            <StatCard className="success">
              <div className="stat-header">
                <div className="stat-title">Completadas</div>
                <div className="stat-icon">✅</div>
              </div>
              <div className="stat-value">{estadisticas?.completadas || 0}</div>
              <div className="stat-subtitle">
                Tareas finalizadas
              </div>
            </StatCard>

            <StatCard className="warning">
              <div className="stat-header">
                <div className="stat-title">En Progreso</div>
                <div className="stat-icon">🔄</div>
              </div>
              <div className="stat-value">{estadisticas?.enProgreso || 0}</div>
              <div className="stat-subtitle">
                Tareas activas
              </div>
            </StatCard>

            <StatCard className="error">
              <div className="stat-header">
                <div className="stat-title">Pendientes</div>
                <div className="stat-icon">⏳</div>
              </div>
              <div className="stat-value">{estadisticas?.pendientes || 0}</div>
              <div className="stat-subtitle">
                Por realizar
              </div>
            </StatCard>
          </StatsGridStyled>

          <ContentGrid>
            <Section style={{ gridColumn: '1 / -1' }}>
              <h3>📅 Calendario Semanal</h3>
              <CalendarioSemanal
                planificaciones={planificaciones}
                onTareaClick={handleTareaClick}
                onDiaClick={handleDiaClick}
              />
            </Section>

            <Section>
              <h3>📋 Planificaciones de la Semana</h3>
              <TareasList>
                {planificaciones.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#6B7280', padding: '2rem' }}>
                    No hay planificaciones para esta semana
                  </div>
                ) : (
                  planificaciones.map(planificacion => (
                    <div key={planificacion.id} className="tarea-item">
                      <div className="tarea-info">
                        <div className="titulo">{planificacion.nombre}</div>
                        <div className="detalles">
                          {getTipoLabel(planificacion.tipo)} • {formatDate(planificacion.fecha)}
                          {planificacion.tareas && planificacion.tareas.length > 0 && (
                            <span> • {planificacion.tareas.length} tareas</span>
                          )}
                        </div>
                      </div>
                      <div className="tarea-actions">
                        <button 
                          onClick={() => handleNuevaTarea(planificacion)}
                          title="Agregar tarea"
                        >
                          ➕
                        </button>
                        <button 
                          onClick={() => handleDelete(planificacion.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </TareasList>
            </Section>
          </ContentGrid>
        </>
      )}

      {/* Modal para nueva planificación */}
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <h2>Nueva Planificación</h2>
          <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
              <label>Nombre de la Planificación *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Producción de Tartas, Limpieza General"
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <label>Fecha *</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Tipo *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  required
                >
                  {Object.entries(TIPOS_PLANIFICACION).map(([key, value]) => (
                    <option key={key} value={value}>
                      {getTipoLabel(value)}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <label>Prioridad</label>
              <select
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
              >
                {Object.entries(PRIORIDADES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
            </FormGroup>

            <FormGroup>
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Detalles adicionales de la planificación..."
              />
            </FormGroup>

            <FormActions>
              <FormButton
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="secondary"
              >
                Cancelar
              </FormButton>
              <FormButton
                type="submit"
                disabled={saving}
                className="primary"
              >
                {saving ? 'Guardando...' : 'Crear Planificación'}
              </FormButton>
            </FormActions>
          </FormContainer>
        </ModalContent>
      </Modal>

      {/* Modal para nueva tarea */}
      <Modal isOpen={isTareaModalOpen}>
        <ModalContent>
          <h2>Nueva Tarea - {selectedPlanificacion?.nombre}</h2>
          <FormContainer onSubmit={handleTareaSubmit}>
            <FormGroup>
              <label>Título de la Tarea *</label>
              <input
                type="text"
                value={tareaData.titulo}
                onChange={(e) => setTareaData({ ...tareaData, titulo: e.target.value })}
                placeholder="Ej: Preparar masa, Cortar verduras"
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <label>Hora de Inicio</label>
                <input
                  type="time"
                  value={tareaData.hora_inicio}
                  onChange={(e) => setTareaData({ ...tareaData, hora_inicio: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <label>Hora de Fin</label>
                <input
                  type="time"
                  value={tareaData.hora_fin}
                  onChange={(e) => setTareaData({ ...tareaData, hora_fin: e.target.value })}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <label>Tipo</label>
                <select
                  value={tareaData.tipo}
                  onChange={(e) => setTareaData({ ...tareaData, tipo: e.target.value })}
                >
                  {Object.entries(TIPOS_PLANIFICACION).map(([key, value]) => (
                    <option key={key} value={value}>
                      {getTipoLabel(value)}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup>
                <label>Prioridad</label>
                <select
                  value={tareaData.prioridad}
                  onChange={(e) => setTareaData({ ...tareaData, prioridad: e.target.value })}
                >
                  {Object.entries(PRIORIDADES).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <label>Duración Estimada (minutos)</label>
              <input
                type="number"
                min="0"
                value={tareaData.duracion_estimada}
                onChange={(e) => setTareaData({ ...tareaData, duracion_estimada: e.target.value })}
                placeholder="30"
              />
            </FormGroup>

            <FormGroup>
              <label>Descripción</label>
              <textarea
                value={tareaData.descripcion}
                onChange={(e) => setTareaData({ ...tareaData, descripcion: e.target.value })}
                placeholder="Detalles de la tarea..."
              />
            </FormGroup>

            <FormGroup>
              <label>Observaciones</label>
              <textarea
                value={tareaData.observaciones}
                onChange={(e) => setTareaData({ ...tareaData, observaciones: e.target.value })}
                placeholder="Notas adicionales..."
              />
            </FormGroup>

            <FormActions>
              <FormButton
                type="button"
                onClick={() => setIsTareaModalOpen(false)}
                className="secondary"
              >
                Cancelar
              </FormButton>
              <FormButton
                type="submit"
                disabled={saving}
                className="primary"
              >
                {saving ? 'Guardando...' : 'Crear Tarea'}
              </FormButton>
            </FormActions>
          </FormContainer>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Planificaciones;
