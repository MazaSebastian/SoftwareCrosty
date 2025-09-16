import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import backupService from '../services/backupService';

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

const BackupControls = styled.div`
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

const BackupList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
`;

const BackupItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #F3F4F6;
  background: ${props => props.isLatest ? '#F0F9FF' : 'white'};

  &:last-child {
    border-bottom: none;
  }

  .backup-info {
    flex: 1;

    .backup-name {
      font-weight: 600;
      color: #722F37;
      margin-bottom: 5px;
    }

    .backup-details {
      font-size: 0.9rem;
      color: #6B7280;
    }
  }

  .backup-actions {
    display: flex;
    gap: 10px;
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

const Configuracion = () => {
  const [backupState, setBackupState] = useState({
    isRunning: false,
    lastBackup: null,
    backupHistory: [],
    isAutomaticEnabled: false
  });
  const [backups, setBackups] = useState([]);
  const [intervalo, setIntervalo] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Cargar estado inicial
  useEffect(() => {
    cargarEstadoBackup();
    cargarBackups();
  }, []);

  const cargarEstadoBackup = () => {
    const estado = backupService.obtenerEstado();
    setBackupState(estado);
  };

  const cargarBackups = () => {
    const listaBackups = backupService.obtenerListaBackups();
    setBackups(listaBackups);
  };

  const mostrarMensaje = (texto, tipo = 'info') => {
    setMessage(texto);
    setTimeout(() => setMessage(''), 3000);
  };

  const iniciarBackupAutomatico = () => {
    try {
      backupService.configurarBackupAutomatico(intervalo);
      setBackupState(prev => ({ ...prev, isAutomaticEnabled: true }));
      mostrarMensaje(`✅ Backup automático iniciado cada ${intervalo} minutos`, 'success');
    } catch (error) {
      mostrarMensaje('❌ Error iniciando backup automático', 'error');
    }
  };

  const detenerBackupAutomatico = () => {
    try {
      backupService.detenerBackupAutomatico();
      setBackupState(prev => ({ ...prev, isAutomaticEnabled: false }));
      mostrarMensaje('⏹️ Backup automático detenido', 'info');
    } catch (error) {
      mostrarMensaje('❌ Error deteniendo backup automático', 'error');
    }
  };

  const crearBackupManual = async () => {
    setIsLoading(true);
    try {
      const backup = await backupService.ejecutarBackupAutomatico();
      cargarBackups();
      cargarEstadoBackup();
      mostrarMensaje('✅ Backup manual creado exitosamente', 'success');
    } catch (error) {
      mostrarMensaje('❌ Error creando backup manual', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const restaurarBackup = async (backupId) => {
    if (!window.confirm('¿Estás seguro de que quieres restaurar este backup? Esto sobrescribirá los datos actuales.')) {
      return;
    }

    setIsLoading(true);
    try {
      await backupService.restaurarBackup(backupId);
      mostrarMensaje('✅ Backup restaurado exitosamente', 'success');
    } catch (error) {
      mostrarMensaje('❌ Error restaurando backup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const exportarBackup = async (backupId) => {
    try {
      await backupService.exportarBackup(backupId);
      mostrarMensaje('📤 Backup exportado exitosamente', 'success');
    } catch (error) {
      mostrarMensaje('❌ Error exportando backup', 'error');
    }
  };

  const eliminarBackup = (backupId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este backup?')) {
      return;
    }

    try {
      backupService.eliminarBackup(backupId);
      cargarBackups();
      mostrarMensaje('🗑️ Backup eliminado exitosamente', 'info');
    } catch (error) {
      mostrarMensaje('❌ Error eliminando backup', 'error');
    }
  };

  const limpiarBackupsAntiguos = () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar los backups antiguos (más de 30 días)?')) {
      return;
    }

    try {
      const eliminados = backupService.limpiarBackupsAntiguos(30);
      cargarBackups();
      mostrarMensaje(`🧹 ${eliminados} backups antiguos eliminados`, 'info');
    } catch (error) {
      mostrarMensaje('❌ Error limpiando backups', 'error');
    }
  };

  const formatearFecha = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES');
  };

  const formatearTamaño = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <PageContainer>
      <Header>
        <h1>⚙️ Configuración del Sistema</h1>
        <p>Gestiona las opciones generales y el sistema de backup de tu aplicación CROSTY.</p>
      </Header>

      <Content>
        {/* Sistema de Backup */}
        <Section>
          <h3>🔄 Sistema de Backup Automático</h3>
          
          <StatusIndicator status={backupState.isAutomaticEnabled ? 'active' : 'inactive'}>
            <div className="status-dot"></div>
            <span>
              {backupState.isAutomaticEnabled ? 'Backup automático ACTIVO' : 'Backup automático INACTIVO'}
            </span>
          </StatusIndicator>

          <BackupControls>
            <ControlCard>
              <h4>📅 Configuración</h4>
              <p>Establece el intervalo de backup automático</p>
              <Label>Intervalo (minutos):</Label>
              <Input
                type="number"
                value={intervalo}
                onChange={(e) => setIntervalo(parseInt(e.target.value) || 60)}
                min="5"
                max="1440"
              />
              <div>
                <Button 
                  variant="primary" 
                  onClick={iniciarBackupAutomatico}
                  disabled={backupState.isAutomaticEnabled}
                >
                  ▶️ Iniciar Automático
                </Button>
                <Button 
                  variant="danger" 
                  onClick={detenerBackupAutomatico}
                  disabled={!backupState.isAutomaticEnabled}
                >
                  ⏹️ Detener
                </Button>
              </div>
            </ControlCard>

            <ControlCard>
              <h4>💾 Backup Manual</h4>
              <p>Crea un backup inmediato de todos los datos</p>
              <Button 
                variant="success" 
                onClick={crearBackupManual}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Creando...' : '💾 Crear Backup'}
              </Button>
            </ControlCard>

            <ControlCard>
              <h4>🧹 Mantenimiento</h4>
              <p>Limpia backups antiguos para liberar espacio</p>
              <Button 
                variant="danger" 
                onClick={limpiarBackupsAntiguos}
              >
                🗑️ Limpiar Antiguos
              </Button>
            </ControlCard>
          </BackupControls>

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

        {/* Lista de Backups */}
        <Section>
          <h3>📋 Historial de Backups</h3>
          
          {backups.length === 0 ? (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px' }}>
              No hay backups disponibles. Crea tu primer backup para comenzar.
            </p>
          ) : (
            <BackupList>
              {backups.map((backup, index) => (
                <BackupItem key={backup.id} isLatest={index === 0}>
                  <div className="backup-info">
                    <div className="backup-name">{backup.nombre}</div>
                    <div className="backup-details">
                      {formatearFecha(backup.timestamp)} • {formatearTamaño(backup.tamaño)} • {backup.tipo}
                    </div>
                  </div>
                  <div className="backup-actions">
                    <Button 
                      variant="primary" 
                      onClick={() => exportarBackup(backup.id)}
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      📤 Exportar
                    </Button>
                    <Button 
                      variant="success" 
                      onClick={() => restaurarBackup(backup.id)}
                      disabled={isLoading}
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      🔄 Restaurar
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => eliminarBackup(backup.id)}
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </BackupItem>
              ))}
            </BackupList>
          )}
        </Section>

        {/* Información del Sistema */}
        <Section>
          <h3>ℹ️ Información del Sistema</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <strong>Versión de la Aplicación:</strong> 1.0.0
            </div>
            <div>
              <strong>Desarrollador:</strong> CROSTY Software
            </div>
            <div>
              <strong>Última Actualización:</strong> Septiembre 2024
            </div>
            <div>
              <strong>Total de Backups:</strong> {backups.length}
            </div>
            <div>
              <strong>Último Backup:</strong> {backupState.lastBackup ? formatearFecha(backupState.lastBackup.timestamp) : 'Nunca'}
            </div>
            <div>
              <strong>Estado del Sistema:</strong> {backupState.isAutomaticEnabled ? '🟢 Activo' : '🟡 Inactivo'}
            </div>
          </div>
        </Section>
      </Content>
    </PageContainer>
  );
};

export default Configuracion;