import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SyncContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
  }
`;

const SyncStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  background: ${props => {
    switch (props.status) {
      case 'connected': return 'rgba(16, 185, 129, 0.9)';
      case 'connecting': return 'rgba(245, 158, 11, 0.9)';
      case 'disconnected': return 'rgba(239, 68, 68, 0.9)';
      case 'error': return 'rgba(156, 163, 175, 0.9)';
      default: return 'rgba(107, 114, 128, 0.9)';
    }
  }};
  color: white;
  border: 1px solid ${props => {
    switch (props.status) {
      case 'connected': return 'rgba(16, 185, 129, 0.3)';
      case 'connecting': return 'rgba(245, 158, 11, 0.3)';
      case 'disconnected': return 'rgba(239, 68, 68, 0.3)';
      case 'error': return 'rgba(156, 163, 175, 0.3)';
      default: return 'rgba(107, 114, 128, 0.3)';
    }
  }};
`;

const SyncIcon = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  background: ${props => {
    switch (props.status) {
      case 'connected': return '#10B981';
      case 'connecting': return '#F59E0B';
      case 'disconnected': return '#EF4444';
      case 'error': return '#9CA3AF';
      default: return '#6B7280';
    }
  }};
  animation: ${props => {
    switch (props.status) {
      case 'connected': return `${pulse} 2s infinite`;
      case 'connecting': return `${rotate} 1s linear infinite`;
      case 'disconnected': return `${pulse} 1s infinite`;
      default: return 'none';
    }
  }};
  
  ${props => props.status === 'connecting' && `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  `}
`;

const SyncText = styled.span`
  white-space: nowrap;
`;

const SyncDetails = styled.div`
  font-size: 0.7rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #EF4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  animation: ${pulse} 1s infinite;
`;

const SyncIndicator = ({ 
  connectionStatus, 
  notificationCount = 0,
  onNotificationClick 
}) => {
  const [status, setStatus] = useState('disconnected');
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (connectionStatus) {
      if (connectionStatus.isConnected) {
        setStatus('connected');
        setDetails('Sincronizado');
      } else if (connectionStatus.reconnectAttempts > 0) {
        setStatus('connecting');
        setDetails(`Reconectando... (${connectionStatus.reconnectAttempts})`);
      } else {
        setStatus('disconnected');
        setDetails('Sin conexión');
      }
    }
  }, [connectionStatus]);

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'En línea';
      case 'connecting':
        return 'Conectando';
      case 'disconnected':
        return 'Desconectado';
      case 'error':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return '🟢';
      case 'connecting':
        return '🟡';
      case 'disconnected':
        return '🔴';
      case 'error':
        return '⚫';
      default:
        return '⚪';
    }
  };

  return (
    <SyncContainer>
      <SyncStatus status={status}>
        <SyncIcon status={status} />
        <SyncText>{getStatusText()}</SyncText>
        {notificationCount > 0 && (
          <NotificationBadge onClick={onNotificationClick}>
            {notificationCount}
          </NotificationBadge>
        )}
      </SyncStatus>
      {details && (
        <SyncDetails>{details}</SyncDetails>
      )}
    </SyncContainer>
  );
};

export default SyncIndicator;
