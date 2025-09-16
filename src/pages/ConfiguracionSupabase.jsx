import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import migrationService from '../services/migrationService';
import syncService from '../services/syncService';
import { supabaseUtils } from '../config/supabase';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #FFFFFF;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #722F37;
    margin: 0 0 0.5rem 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .subtitle {
    color: #6B7280;
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const ConfigSection = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  
  h3 {
    color: #722F37;
    margin: 0 0 1.5rem 0;
    font-size: 1.3rem;
    font-weight: 600;
  }
`;

const StatusCard = styled.div`
  background: ${props => {
    switch (props.status) {
      case 'connected': return '#D1FAE5';
      case 'error': return '#FEE2E2';
      case 'warning': return '#FEF3C7';
      default: return '#F3F4F6';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'connected': return '#10B981';
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return '#D1D5DB';
    }
  }};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  .status-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    
    .status-icon {
      font-size: 1.2rem;
    }
    
    .status-title {
      font-weight: 600;
      color: ${props => {
        switch (props.status) {
          case 'connected': return '#065F46';
          case 'error': return '#991B1B';
          case 'warning': return '#92400E';
          default: return '#374151';
        }
      }};
    }
  }
  
  .status-message {
    color: ${props => {
      switch (props.status) {
        case 'connected': return '#047857';
        case 'error': return '#B91C1C';
        case 'warning': return '#B45309';
        default: return '#6B7280';
      }
    }};
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' ? '#722F37' : '#6B7280'};
  border: 1px solid #E5E7EB;
  color: #FFFFFF;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#8B3A42' : '#4B5563'};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background: #D1D5DB;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #722F37, #8B3A42);
    width: ${props => props.progress}%;
    transition: width 0.3s ease;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  .label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
  }
  
  .value {
    color: #6B7280;
    font-size: 0.9rem;
  }
`;

const ConfiguracionSupabase = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [migrationStatus, setMigrationStatus] = useState('idle');
  const [syncStatus, setSyncStatus] = useState(null);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConnection();
    getSyncStatus();
  }, []);

  // Verificar conexión con Supabase
  const checkConnection = async () => {
    try {
      setIsLoading(true);
      const result = await migrationService.testConnection();
      
      if (result.success) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('Error verificando conexión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener estado de sincronización
  const getSyncStatus = () => {
    const status = syncService.getSyncStatus();
    setSyncStatus(status);
  };

  // Iniciar migración
  const startMigration = async () => {
    try {
      setIsLoading(true);
      setMigrationStatus('migrating');
      setMigrationProgress(0);

      const result = await migrationService.startMigration();
      
      if (result.success) {
        setMigrationStatus('completed');
        setMigrationProgress(100);
        alert('✅ Migración completada exitosamente');
      }
    } catch (error) {
      setMigrationStatus('error');
      console.error('Error en migración:', error);
      alert('❌ Error en migración: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Sincronización completa
  const fullSync = async () => {
    try {
      setIsLoading(true);
      await syncService.fullSync();
      getSyncStatus();
      alert('✅ Sincronización completada');
    } catch (error) {
      console.error('Error en sincronización:', error);
      alert('❌ Error en sincronización: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar datos locales
  const cleanupLocalData = async () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todos los datos locales? Esta acción no se puede deshacer.')) {
      try {
        await migrationService.cleanupLocalData();
        alert('✅ Datos locales limpiados');
      } catch (error) {
        console.error('Error limpiando datos:', error);
        alert('❌ Error limpiando datos: ' + error.message);
      }
    }
  };

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: '✅',
          title: 'Conectado a Supabase',
          message: 'La conexión con la base de datos está funcionando correctamente'
        };
      case 'error':
        return {
          icon: '❌',
          title: 'Error de Conexión',
          message: 'No se pudo conectar con Supabase. Verifica la configuración.'
        };
      default:
        return {
          icon: '⏳',
          title: 'Verificando Conexión',
          message: 'Comprobando el estado de la conexión...'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <PageContainer>
      <Header>
        <h1>Configuración de Supabase</h1>
        <div className="subtitle">
          Configuración y sincronización con la base de datos en la nube
        </div>
      </Header>

      <ConfigSection>
        <h3>🔗 Estado de Conexión</h3>
        
        <StatusCard status={connectionStatus}>
          <div className="status-header">
            <span className="status-icon">{statusInfo.icon}</span>
            <span className="status-title">{statusInfo.title}</span>
          </div>
          <div className="status-message">{statusInfo.message}</div>
        </StatusCard>

        <Button 
          variant="primary" 
          onClick={checkConnection}
          disabled={isLoading}
        >
          🔄 Verificar Conexión
        </Button>
      </ConfigSection>

      <ConfigSection>
        <h3>📊 Estado de Sincronización</h3>
        
        {syncStatus && (
          <InfoGrid>
            <InfoItem>
              <div className="label">Estado de Conexión</div>
              <div className="value">
                {syncStatus.isOnline ? '🌐 En línea' : '📴 Sin conexión'}
              </div>
            </InfoItem>
            
            <InfoItem>
              <div className="label">Última Sincronización</div>
              <div className="value">
                {syncStatus.lastSyncTime ? 
                  new Date(syncStatus.lastSyncTime).toLocaleString('es-AR') : 
                  'Nunca'
                }
              </div>
            </InfoItem>
            
            <InfoItem>
              <div className="label">Cola de Sincronización</div>
              <div className="value">
                {syncStatus.queueLength} operaciones pendientes
              </div>
            </InfoItem>
            
            <InfoItem>
              <div className="label">Suscripciones Activas</div>
              <div className="value">
                {syncStatus.activeSubscriptions} tablas
              </div>
            </InfoItem>
          </InfoGrid>
        )}

        <Button 
          variant="primary" 
          onClick={fullSync}
          disabled={isLoading || !syncStatus?.isOnline}
        >
          🔄 Sincronización Completa
        </Button>
      </ConfigSection>

      <ConfigSection>
        <h3>🚀 Migración de Datos</h3>
        
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
          Migra todos los datos locales a Supabase para compartir información entre usuarios.
        </p>

        {migrationStatus === 'migrating' && (
          <div>
            <div style={{ marginBottom: '0.5rem' }}>Migrando datos...</div>
            <ProgressBar progress={migrationProgress}>
              <div className="progress-fill"></div>
            </ProgressBar>
            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6B7280' }}>
              {migrationProgress}%
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            onClick={startMigration}
            disabled={isLoading || connectionStatus !== 'connected'}
          >
            🚀 Iniciar Migración
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={cleanupLocalData}
            disabled={isLoading}
          >
            🧹 Limpiar Datos Locales
          </Button>
        </div>
      </ConfigSection>

      <ConfigSection>
        <h3>⚙️ Configuración</h3>
        
        <InfoGrid>
          <InfoItem>
            <div className="label">URL de Supabase</div>
            <div className="value">
              {process.env.REACT_APP_SUPABASE_URL || 'No configurado'}
            </div>
          </InfoItem>
          
          <InfoItem>
            <div className="label">Clave Anónima</div>
            <div className="value">
              {process.env.REACT_APP_SUPABASE_ANON_KEY ? 
                '***' + process.env.REACT_APP_SUPABASE_ANON_KEY.slice(-4) : 
                'No configurado'
              }
            </div>
          </InfoItem>
        </InfoGrid>

        <div style={{ 
          background: '#FEF3C7', 
          border: '1px solid #F59E0B', 
          borderRadius: '8px', 
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ fontWeight: '600', color: '#92400E', marginBottom: '0.5rem' }}>
            ⚠️ Configuración Requerida
          </div>
          <div style={{ color: '#B45309', fontSize: '0.9rem' }}>
            Para usar Supabase, configura las variables de entorno REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY
          </div>
        </div>
      </ConfigSection>

      <ConfigSection>
        <h3>📋 Instrucciones</h3>
        
        <div style={{ color: '#6B7280', lineHeight: '1.6' }}>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Configurar Supabase:</strong> Crea un proyecto en Supabase y obtén las credenciales
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Variables de entorno:</strong> Configura REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Crear tablas:</strong> Ejecuta los scripts SQL para crear las tablas necesarias
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Migrar datos:</strong> Usa el botón "Iniciar Migración" para transferir datos locales
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Sincronización:</strong> Los datos se sincronizarán automáticamente entre usuarios
            </li>
          </ol>
        </div>
      </ConfigSection>
    </PageContainer>
  );
};

export default ConfiguracionSupabase;

